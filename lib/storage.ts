export type Goal = "TRACK" | "PREVENT" | "CONCEIVE";

export type StoredProfile = {
  firstName: string;
  lastPeriodDate: string;
  cycleLength: number;
  goal: Goal;
  discreetMode: boolean;
};

export type JournalEntry = {
  id: string;
  logDate: string;
  flow: string | null;
  symptoms: string[];
  mood: string | null;
  notes: string;
};

const PROFILE_KEY = "naya-profile";
const LOGS_KEY = "naya-logs";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readProfile(): StoredProfile | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(PROFILE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: StoredProfile): StoredProfile {
  if (!isBrowser()) {
    return profile;
  }

  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

export function readLogs(): JournalEntry[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(LOGS_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

export function saveLogs(logs: JournalEntry[]): JournalEntry[] {
  if (!isBrowser()) {
    return logs;
  }

  window.localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  return logs;
}

export function upsertLog(entry: Omit<JournalEntry, "id"> & { id?: string }) {
  const logs = readLogs();
  const normalized = {
    id: entry.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    logDate: entry.logDate,
    flow: entry.flow ?? null,
    symptoms: entry.symptoms ?? [],
    mood: entry.mood ?? null,
    notes: entry.notes ?? "",
  };

  const nextLogs = logs.filter((item) => item.logDate !== normalized.logDate);
  nextLogs.push(normalized);

  saveLogs(nextLogs);
  return normalized;
}

export function getTodayLog(): JournalEntry | null {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const isoDate = `${year}-${month}-${day}`;

  return readLogs().find((entry) => entry.logDate === isoDate) ?? null;
}
