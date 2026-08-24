import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// fileStore.js
//
// This is the "File Backend" of the application. Instead of connecting to a
// database (Postgres, Mongo, etc.) it reads and writes a plain JSON file on
// disk (data/favorites.json). It exposes a small, promise-based CRUD API so
// the rest of the backend never has to know it's talking to a file.
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const FAVORITES_FILE = path.join(DATA_DIR, "favorites.json");

// Ensure the data directory + file exist before any read/write happens.
async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FAVORITES_FILE);
  } catch {
    await fs.writeFile(FAVORITES_FILE, "[]", "utf-8");
  }
}

// Simple in-process mutex so concurrent writes don't clobber each other.
let writeQueue = Promise.resolve();
function withLock(task) {
  const result = writeQueue.then(task, task);
  writeQueue = result.catch(() => {});
  return result;
}

async function readAll() {
  await ensureStore();
  const raw = await fs.readFile(FAVORITES_FILE, "utf-8");
  try {
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

async function writeAll(list) {
  await ensureStore();
  await fs.writeFile(FAVORITES_FILE, JSON.stringify(list, null, 2), "utf-8");
  return list;
}

export const favoritesStore = {
  async list() {
    return readAll();
  },

  async add(entry) {
    return withLock(async () => {
      const list = await readAll();

      const exists = list.some(
        (f) =>
          f.name.toLowerCase() === entry.name.toLowerCase() &&
          (f.country || "") === (entry.country || "")
      );
      if (exists) {
        return { list, created: false };
      }

      const record = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        name: entry.name,
        country: entry.country || "",
        latitude: entry.latitude,
        longitude: entry.longitude,
      };

      const updated = [...list, record];
      await writeAll(updated);
      return { list: updated, created: true, record };
    });
  },

  async remove(id) {
    return withLock(async () => {
      const list = await readAll();
      const updated = list.filter((f) => f.id !== id);
      const removed = updated.length !== list.length;
      if (removed) await writeAll(updated);
      return { list: updated, removed };
    });
  },
};
