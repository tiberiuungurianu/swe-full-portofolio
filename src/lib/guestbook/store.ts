import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  GuestbookMessage,
  GuestbookStatus,
  GuestbookStoreFile,
} from "./types";

/**
 * LOCAL / DEV guestbook persistence.
 *
 * Messages are stored in a JSON file under `data/` on the server filesystem.
 * This is intentionally labelled as a local/dev path — not a multi-instance
 * production database. See README and the portfolio handover for how to wire
 * a hosted store later. Do not treat browser localStorage as shared storage.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "guestbook.json");
const TMP_PATH = path.join(DATA_DIR, "guestbook.json.tmp");

const emptyStore = (): GuestbookStoreFile => ({
  version: 1,
  messages: [],
});

async function ensureStore(): Promise<GuestbookStoreFile> {
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
    await atomicWrite(store);
    return store;
  }
}

async function atomicWrite(store: GuestbookStoreFile): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(TMP_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await rename(TMP_PATH, STORE_PATH);
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
  await atomicWrite(store);
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
  await atomicWrite(store);
  return updated;
}

export function getGuestbookStorageMode(): {
  mode: "local-dev-file";
  path: string;
  label: string;
} {
  return {
    mode: "local-dev-file",
    path: "data/guestbook.json",
    label:
      "Local/dev file store (server JSON). Not a production multi-instance database.",
  };
}
