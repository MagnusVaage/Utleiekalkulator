function parseFinnHtml(html: string) {
  const d: Record<string, number | string> = {};

  // Try __NEXT_DATA__ blob first
  const ndMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(\{.+?\})<\/script>/s);
  if (ndMatch) {
    try {
      const nd = JSON.parse(ndMatch[1]);
      const ad =
        nd?.props?.pageProps?.ad ||
        nd?.props?.pageProps?.listing ||
        nd?.props?.pageProps?.finnAd ||
        {};
      const price =
        ad?.price?.amount ||
        ad?.price?.value ||
        ad?.priceRange?.to ||
        ad?.askingPrice?.amount;
      if (price && !d.price) d.price = price;
      const area =
        ad?.size?.from ||
        ad?.primaryRoomArea ||
        ad?.usableArea ||
        ad?.area;
      if (area && !d.bra) d.bra = area;
      const addr =
        ad?.location?.fullAddress ||
        ad?.location?.address ||
        ad?.location?.city;
      if (addr && !d.address) d.address = addr;
    } catch {
      // ignore JSON parse errors
    }
  }

  // Text pattern fallbacks
  const clean = (s: string) => parseInt(s.replace(/[\s\u00a0]/g, ''), 10);

  const tryNum = (re: RegExp, key: string) => {
    if (d[key]) return;
    const m = html.match(re);
    if (m?.[1]) {
      const n = clean(m[1]);
      if (!isNaN(n) && n > 0) d[key] = n;
    }
  };

  tryNum(/Prisantydning[\s\S]{0,200}?([\d\s]{5,12})\s*kr/i, 'price');
  tryNum(/Totalpris[\s\S]{0,200}?([\d\s]{5,12})\s*kr/i, 'total');
  tryNum(/Fellesgjeld[\s\S]{0,200}?([\d\s]{3,10})\s*kr/i, 'gjeld');
  tryNum(/Felleskost\/mnd\.[\s\S]{0,200}?([\d\s]{2,8})\s*kr/i, 'fellesutg');
  tryNum(/Kommunale avg[\s\S]{0,200}?([\d\s]{2,8})\s*kr/i, 'kommunale');
  tryNum(/Primærrom[\s\S]{0,100}?(\d{1,4})\s*m²/i, 'bra');
  tryNum(/Bruksareal[\s\S]{0,100}?(\d{1,4})\s*m²/i, 'bra2');
  tryNum(/(\d{1,2})\s*soverom/i, 'rooms');
  tryNum(/Byggeår[\s\S]{0,100}?((?:19|20)\d{2})/i, 'year');

  if (!d.bra && d.bra2) d.bra = d.bra2;

  if (!d.energy) {
    const em = html.match(/Energimerking[\s\S]{0,200}?([A-G])(?:\s|<)/i);
    if (em?.[1]) d.energy = em[1];
  }

  if (!d.title) {
    const tm = html.match(/<title>([^<]+)<\/title>/i);
    if (tm?.[1]) d.title = tm[1].replace(/ - FINN\.no$/i, '').trim();
  }

  if (!d.address) {
    const am = html.match(/"address"\s*:\s*"([^"]{5,80})"/i);
    if (am?.[1]) d.address = am[1];
  }

  return d;
}

interface ComputedResult {
  score: number;
  label: string;
  labelColor: string;
  totalPrice: number;
  prisantydning: number;
  gjeld: number;
  bra: number;
  rooms: number;
  year: number;
  rent: number;
  fellesutg: number;
  monthlyCF: number;
  grossYield: number;
  netYield: number;
  equity: number;
  roeCash: number;
  paybackYears: number;
  loan: number;
  pmt: number;
  wf: { label: string; value: number; type: string }[];
  address: string;
  title: string;
  energy: string;
  pricePerSqm: number;
}

function compute(raw: Record<string, number | string>): ComputedResult {
  const price = (raw.price as number) || 0;
  const gjeld = (raw.gjeld as number) || 0;
  const total = (raw.total as number) || (price + gjeld) || price;
  const bra = Math.max(20, (raw.bra as number) || 50);
  const rooms = (raw.rooms as number) || 1;
  const year = (raw.year as number) || 2000;
  const title = (raw.title as string) || '';
  const address = (raw.address as string) || '';

  const combined = (title + ' ' + address).toLowerCase();
  let rpsq = 210;
  if (/(oslo|frogner|grünerløkka|sagene|majorstua|st\.hanshaugen|aker brygge|tjuvholmen|grønland)/i.test(combined)) rpsq = 300;
  else if (/(stavanger|sandnes)/i.test(combined)) rpsq = 260;
  else if (/(bergen|fana|åsane|laksevåg)/i.test(combined)) rpsq = 250;
  else if (/trondheim/i.test(combined)) rpsq = 235;
  else if (/(kristiansand|tromsø|drammen|fredrikstad)/i.test(combined)) rpsq = 220;

  if (rooms >= 2) rpsq += 10;
  if (rooms >= 3) rpsq += 10;
  if (year >= 2010) rpsq += 5;
  if (year >= 2020) rpsq += 5;

  const rent = Math.round(bra * rpsq);

  const loan = total * 0.85;
  const equity = total * 0.15;
  const r = 0.0525 / 12;
  const n = 25 * 12;
  const pmt = Math.round(loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  const fellesutgBase = ((raw.fellesutg as number) || 0) + ((raw.kommunale as number) || 0);
  const fellesutg = fellesutgBase || Math.round(bra * 38);
  const vacancy = Math.round(rent * 0.04);
  const maintenance = Math.round(rent * 0.03);
  const monthlyCF = Math.round(rent - fellesutg - vacancy - maintenance - pmt);

  const grossYield = total > 0 ? (rent * 12) / total * 100 : 0;
  const netYield = total > 0 ? ((rent - fellesutg - vacancy - maintenance) * 12) / total * 100 : 0;
  const roeCash = equity > 0 ? (monthlyCF * 12) / equity * 100 : 0;
  const paybackYears = monthlyCF > 0 ? equity / (monthlyCF * 12) : 99;
  const pricePerSqm = bra > 0 ? Math.round(total / bra) : 0;

  let score = 0;
  if (grossYield >= 8) score += 30;
  else if (grossYield >= 6) score += 22;
  else if (grossYield >= 5) score += 15;
  else if (grossYield >= 4) score += 8;
  else score += 3;

  if (monthlyCF >= 3000) score += 20;
  else if (monthlyCF >= 1000) score += 15;
  else if (monthlyCF >= 0) score += 8;
  else score += 2;

  if (pricePerSqm < 50000) score += 20;
  else if (pricePerSqm < 75000) score += 14;
  else if (pricePerSqm < 100000) score += 8;
  else score += 3;

  if (year >= 2015) score += 10;
  else if (year >= 2000) score += 7;
  else if (year >= 1990) score += 5;
  else score += 2;

  const gjeldPct = total > 0 ? gjeld / total : 0;
  if (gjeldPct < 0.1) score += 10;
  else if (gjeldPct < 0.2) score += 7;
  else if (gjeldPct < 0.35) score += 4;
  else score += 1;

  if (rooms >= 3) score += 10;
  else if (rooms >= 2) score += 7;
  else score += 3;

  score = Math.min(100, Math.max(0, score));

  const label =
    score >= 75 ? 'STERK DEAL' :
    score >= 60 ? 'SOLID' :
    score >= 45 ? 'NØYTRAL' :
    score >= 30 ? 'SVAK' : 'UNNGÅ';

  const labelColor =
    score >= 75 ? '#22c55e' :
    score >= 60 ? '#84cc16' :
    score >= 45 ? '#eab308' :
    score >= 30 ? '#f97316' : '#ef4444';

  const wf = [
    { label: 'Leieinntekt', value: rent, type: 'income' },
    { label: 'Felleskost', value: -fellesutg, type: 'expense' },
    { label: 'Ledighet', value: -vacancy, type: 'expense' },
    { label: 'Vedlikehold', value: -maintenance, type: 'expense' },
    { label: 'Lånekostnad', value: -pmt, type: 'expense' },
    { label: 'Netto CF', value: monthlyCF, type: monthlyCF >= 0 ? 'net-pos' : 'net-neg' },
  ];

  return {
    score,
    label,
    labelColor,
    totalPrice: total,
    prisantydning: price || total,
    gjeld,
    bra,
    rooms,
    year,
    rent,
    fellesutg,
    monthlyCF,
    grossYield: Math.round(grossYield * 10) / 10,
    netYield: Math.round(netYield * 10) / 10,
    equity: Math.round(equity),
    roeCash: Math.round(roeCash * 10) / 10,
    paybackYears: Math.round(paybackYears * 10) / 10,
    loan: Math.round(loan),
    pmt,
    wf,
    address,
    title,
    energy: (raw.energy as string) || '',
    pricePerSqm,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return Response.json({ error: 'Mangler URL' }, { status: 400 });
  }

  if (!url.includes('finn.no')) {
    return Response.json({ error: 'Kun Finn.no URL-er støttes' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'nb-NO,nb;q=0.9,no;q=0.8,en;q=0.5',
        'Cache-Control': 'no-cache',
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return Response.json({ error: `Finn.no svarte med feil: ${res.status}` }, { status: 502 });
    }

    const html = await res.text();
    const raw = parseFinnHtml(html);
    const result = compute(raw);

    return Response.json(result);
  } catch (err) {
    console.error('Analyze error:', err);
    return Response.json({ error: 'Kunne ikke hente annonsen. Sjekk at URL-en er korrekt.' }, { status: 500 });
  }
}
