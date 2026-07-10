// Veiledende markedsdata per sted (tidlig 2026).
// kvmPris = ca. kvadratmeterpris bruktbolig, leieN = typisk mnd-leie for N-roms.
// Kilder: offentlig statistikk og markedsplasser — estimater, ikke fasit.

export type Sted = {
  slug: string;
  navn: string;
  type: "by" | "bydel";
  fylke: string;
  kvmPris: number;
  leie1: number;
  leie2: number;
  leie3: number;
};

export const STEDER: Sted[] = [
  // Oslo + bydeler
  { slug: "oslo", navn: "Oslo", type: "by", fylke: "Oslo", kvmPris: 105000, leie1: 13500, leie2: 17500, leie3: 23000 },
  { slug: "grunerlokka", navn: "Grünerløkka", type: "bydel", fylke: "Oslo", kvmPris: 103000, leie1: 13500, leie2: 17000, leie3: 22000 },
  { slug: "frogner", navn: "Frogner", type: "bydel", fylke: "Oslo", kvmPris: 125000, leie1: 14500, leie2: 19000, leie3: 26000 },
  { slug: "majorstuen", navn: "Majorstuen", type: "bydel", fylke: "Oslo", kvmPris: 118000, leie1: 14000, leie2: 18500, leie3: 25000 },
  { slug: "sagene", navn: "Sagene", type: "bydel", fylke: "Oslo", kvmPris: 104000, leie1: 13000, leie2: 16800, leie3: 21500 },
  { slug: "st-hanshaugen", navn: "St. Hanshaugen", type: "bydel", fylke: "Oslo", kvmPris: 111000, leie1: 13500, leie2: 17500, leie3: 23000 },
  { slug: "gamle-oslo", navn: "Gamle Oslo", type: "bydel", fylke: "Oslo", kvmPris: 95000, leie1: 13000, leie2: 16500, leie3: 21000 },
  { slug: "grorud", navn: "Grorud", type: "bydel", fylke: "Oslo", kvmPris: 64000, leie1: 11500, leie2: 14500, leie3: 17500 },
  // Storbyer
  { slug: "bergen", navn: "Bergen", type: "by", fylke: "Vestland", kvmPris: 56000, leie1: 11000, leie2: 14000, leie3: 18000 },
  { slug: "trondheim", navn: "Trondheim", type: "by", fylke: "Trøndelag", kvmPris: 59000, leie1: 11500, leie2: 14500, leie3: 18500 },
  { slug: "stavanger", navn: "Stavanger", type: "by", fylke: "Rogaland", kvmPris: 52000, leie1: 11000, leie2: 14000, leie3: 18000 },
  { slug: "sandnes", navn: "Sandnes", type: "by", fylke: "Rogaland", kvmPris: 45000, leie1: 10500, leie2: 13000, leie3: 16500 },
  { slug: "tromso", navn: "Tromsø", type: "by", fylke: "Troms", kvmPris: 56000, leie1: 12000, leie2: 15000, leie3: 19000 },
  { slug: "drammen", navn: "Drammen", type: "by", fylke: "Buskerud", kvmPris: 51000, leie1: 10500, leie2: 13500, leie3: 17000 },
  { slug: "kristiansand", navn: "Kristiansand", type: "by", fylke: "Agder", kvmPris: 46000, leie1: 10000, leie2: 13000, leie3: 16500 },
  { slug: "fredrikstad", navn: "Fredrikstad", type: "by", fylke: "Østfold", kvmPris: 43000, leie1: 9500, leie2: 12500, leie3: 15500 },
  { slug: "sarpsborg", navn: "Sarpsborg", type: "by", fylke: "Østfold", kvmPris: 36000, leie1: 9000, leie2: 11500, leie3: 14000 },
  { slug: "bodo", navn: "Bodø", type: "by", fylke: "Nordland", kvmPris: 50000, leie1: 11000, leie2: 13500, leie3: 17000 },
  { slug: "alesund", navn: "Ålesund", type: "by", fylke: "Møre og Romsdal", kvmPris: 42000, leie1: 10000, leie2: 12500, leie3: 16000 },
  { slug: "tonsberg", navn: "Tønsberg", type: "by", fylke: "Vestfold", kvmPris: 47000, leie1: 10000, leie2: 13000, leie3: 16000 },
  { slug: "sandefjord", navn: "Sandefjord", type: "by", fylke: "Vestfold", kvmPris: 44000, leie1: 9500, leie2: 12500, leie3: 15500 },
  { slug: "moss", navn: "Moss", type: "by", fylke: "Østfold", kvmPris: 44000, leie1: 9500, leie2: 12500, leie3: 15500 },
  { slug: "skien", navn: "Skien", type: "by", fylke: "Telemark", kvmPris: 33000, leie1: 9000, leie2: 11500, leie3: 14000 },
  { slug: "hamar", navn: "Hamar", type: "by", fylke: "Innlandet", kvmPris: 45000, leie1: 10000, leie2: 12500, leie3: 15500 },
  { slug: "lillestrom", navn: "Lillestrøm", type: "by", fylke: "Akershus", kvmPris: 62000, leie1: 11500, leie2: 14500, leie3: 18000 },
  { slug: "asker", navn: "Asker", type: "by", fylke: "Akershus", kvmPris: 68000, leie1: 12000, leie2: 15500, leie3: 19500 },
  { slug: "sandvika", navn: "Sandvika (Bærum)", type: "by", fylke: "Akershus", kvmPris: 75000, leie1: 12500, leie2: 16000, leie3: 20500 },
  { slug: "lorenskog", navn: "Lørenskog", type: "by", fylke: "Akershus", kvmPris: 60000, leie1: 11500, leie2: 14000, leie3: 17500 },
];

export const getSted = (slug: string) => STEDER.find((s) => s.slug === slug);

// Brutto yield i % for en typisk 2-roms på 50 m² — én desimal.
export const bruttoYield = (s: Sted) =>
  Math.round(((s.leie2 * 12) / (s.kvmPris * 50)) * 1000) / 10;
