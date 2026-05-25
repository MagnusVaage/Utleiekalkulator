export type SavedProperty = {
  id: string;
  name: string;
  savedAt: number;
  form: Record<string, string>;
  avdragsfrihet: boolean;
  snapshot: {
    price: number;
    afterTaxCF: number;
    arligNettofortjeneste: number;
    nettoYield: number;
    roi: number;
    equity: number;
    loan: number;
  };
};

const KEY = 'utleiekalkulator_saved_v1';

export function loadSaved(): SavedProperty[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProperty(p: SavedProperty) {
  const list = loadSaved();
  const existing = list.findIndex(x => x.id === p.id);
  if (existing >= 0) list[existing] = p;
  else list.unshift(p);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function deleteProperty(id: string) {
  const list = loadSaved().filter(p => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
