import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  GuestbookMessage,
  GuestbookStatus,
  GuestbookStoreFile,
} from "./types";

/**
 * Guestbook persistence.
 *
 * Local Node: JSON file under `data/`.
 * Cloudflare Workers: in-memory fallback when the filesystem rejects writes.
 * Neither path is a production multi-instance database. Wire KV/D1 later.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "guestbook.json");
const TMP_PATH = path.join(DATA_DIR, "guestbook.json.tmp");

type StoreMode = "file" | "memory";

let mode: StoreMode | null = null;
let memoryStore: GuestbookStoreFile = emptyStore();

function emptyStore(): GuestbookStoreFile {
  return {
    version: 1,
    messages: [],
  };
}

function isUnavailableFilesystem(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String(error.code) : "";
  return (
    code === "EPERM" ||
    code === "EROFS" ||
    code === "ENOTSUP" ||
    code === "EINVAL" ||
    /operation not permitted/i.test(
      "message" in error ? String(error.message) : "",
    )
  );
}

async function readFileStore(): Promise<GuestbookStoreFile> {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as GuestbookStoreFile;
    if (!parsed || !Array.isArray(parsed.messages)) {
      return emptyStore();
    }
    return parsed;
  } catch {
    const store = emptyStore();
    await writeFileStore(store);
    return store;
  }
}

async function writeFileStore(store: GuestbookStoreFile): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(TMP_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await rename(TMP_PATH, STORE_PATH);
}

async function ensureStore(): Promise<GuestbookStoreFile> {
  if (mode === "memory") {
    return memoryStore;
  }

  try {
    const store = await readFileStore();
    mode = "file";
    return store;
  } catch (error) {
    if (!isUnavailableFilesystem(error)) throw error;
    mode = "memory";
    memoryStore = emptyStore();
    return memoryStore;
  }
}

async function persistStore(store: GuestbookStoreFile): Promise<void> {
  if (mode === "memory") {
    memoryStore = store;
    return;
  }

  try {
    await writeFileStore(store);
    mode = "file";
  } catch (error) {
    if (!isUnavailableFilesystem(error)) throw error;
    mode = "memory";
    memoryStore = store;
  }
}

export async function listApprovedMessages(): Promise<GuestbookMessage[]> {
  const store = await ensureStore();
  return store.messages
    .filter((message) => message.status === "approved")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export async function listAllMessages(): Promise<GuestbookMessage[]> {
  const store = await ensureStore();
  return [...store.messages].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function createPendingMessage(input: {
  name: string;
  message: string;
}): Promise<GuestbookMessage> {
  const store = await ensureStore();
  const entry: GuestbookMessage = {
    id: randomUUID(),
    name: input.name,
    message: input.message,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store.messages.push(entry);
  await persistStore(store);
  return entry;
}

export async function moderateMessage(
  id: string,
  status: Exclude<GuestbookStatus, "pending">,
): Promise<GuestbookMessage | null> {
  const store = await ensureStore();
  const index = store.messages.findIndex((message) => message.id === id);
  if (index === -1) {
    return null;
  }

  const updated: GuestbookMessage = {
    ...store.messages[index],
    status,
    moderatedAt: new Date().toISOString(),
  };
  store.messages[index] = updated;
  await persistStore(store);
  return updated;
}

export async function getGuestbookStorageMode(): Promise<{
  mode: "local-dev-file" | "worker-memory";
  path: string;
  label: string;
}> {
  await ensureStore();

  if (mode === "memory") {
    return {
      mode: "worker-memory",
      path: "in-memory",
      label:
        "Worker memory store. Notes do not survive across isolates. Replace with KV or D1 for production.",
    };
  }

  return {
    mode: "local-dev-file",
    path: "data/guestbook.json",
    label:
      "Local/dev file store (server JSON). Not a production multi-instance database.",
  };
}
