/** Felles HTTP-hjelper for adapterne: vanlig fetch med nettleser-aktige headere. */
export async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      "accept-language": "nb-NO,nb;q=0.9",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fra ${new URL(url).host}`);
  }
  return res.json();
}
