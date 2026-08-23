/**
 * THREADLOOM DESIGN REMINDER — Persistence is private, replaceable, and separate from the interface.
 * The active workspace uses IndexedDB; encrypted file backup lives in crypto.ts.
 */

import { DEFAULT_RESURFACING_SETTINGS, isResurfacingSettings, isThread, type ResurfacingSettings, type Thread } from "./domain";
import { illustrativeThreads } from "./seed";

const LEGACY_STORAGE_KEY = "threadloom.threads.v1";
const DATABASE_NAME = "threadloom-workspace";
const DATABASE_VERSION = 1;
const STORE_NAME = "workspace";
const WORKSPACE_KEY = "active";

export type WorkspaceSnapshot = {
  threads: Thread[];
  settings: ResurfacingSettings;
};

const initialWorkspace = (): WorkspaceSnapshot => ({
  threads: illustrativeThreads,
  settings: DEFAULT_RESURFACING_SETTINGS,
});

export function isWorkspaceSnapshot(value: unknown): value is WorkspaceSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<WorkspaceSnapshot>;
  return Array.isArray(snapshot.threads) && snapshot.threads.every(isThread) && isResurfacingSettings(snapshot.settings);
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Threadloom could not open its local workspace."));
  });
}

async function readWorkspaceFromDatabase(): Promise<WorkspaceSnapshot | undefined> {
  const database = await openDatabase();
  try {
    return await new Promise<WorkspaceSnapshot | undefined>((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(WORKSPACE_KEY);
      request.onsuccess = () => resolve(isWorkspaceSnapshot(request.result) ? request.result : undefined);
      request.onerror = () => reject(request.error ?? new Error("Threadloom could not read its local workspace."));
    });
  } finally {
    database.close();
  }
}

function readLegacyThreads(): Thread[] | undefined {
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(isThread) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export async function loadWorkspace(): Promise<WorkspaceSnapshot> {
  if (typeof window === "undefined" || !window.indexedDB) return initialWorkspace();
  try {
    const stored = await readWorkspaceFromDatabase();
    if (stored) return stored;

    const migrated: WorkspaceSnapshot = {
      threads: readLegacyThreads() ?? illustrativeThreads,
      settings: DEFAULT_RESURFACING_SETTINGS,
    };
    await saveWorkspace(migrated);
    return migrated;
  } catch {
    return initialWorkspace();
  }
}

export async function saveWorkspace(snapshot: WorkspaceSnapshot): Promise<void> {
  if (typeof window === "undefined" || !window.indexedDB) return;
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(snapshot, WORKSPACE_KEY);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Threadloom could not save its local workspace."));
      transaction.onabort = () => reject(transaction.error ?? new Error("Threadloom stopped saving its local workspace."));
    });
  } finally {
    database.close();
  }
}
