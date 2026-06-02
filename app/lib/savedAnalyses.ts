export type SavedAnalysis = {
  id: string;
  savedAt: number;
  finnUrl: string;
  address: string;
  image: string;
  price: number;
  summary: string;
  counts: { tg3: number; tg2: number; tg1: number };
};

const KEY = 'utleiekalkulator_analyses_v1';

export function loadAnalyses(): SavedAnalysis[] {
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

// Dedup by finnUrl — re-analysing the same listing updates the existing entry.
export function saveAnalysis(a: SavedAnalysis) {
  const list = loadAnalyses().filter(x => x.finnUrl !== a.finnUrl);
  list.unshift(a);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function deleteAnalysis(id: string) {
  const list = loadAnalyses().filter(a => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
