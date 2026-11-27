export type ReportEnding = 'partial' | 'supported';

export type SavedProgress = {
  openedDocumentId: string | null;
  savedEvidenceIds: string[];
  testedTheoryId: string | null;
  includeRevision: boolean;
  includeDraft: boolean;
  includeVaultLog: boolean;
  reportEnding: ReportEnding | null;
};

const SAVE_KEY = 'ghost-protocol:first-case:v1';

export function loadProgress(): Partial<SavedProgress> {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return {};

    const saved = JSON.parse(raw) as Partial<SavedProgress> | null;
    return saved && Array.isArray(saved.savedEvidenceIds) ? saved : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: SavedProgress) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  } catch {
    // The game can still run when browser storage is unavailable.
  }
}
