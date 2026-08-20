import { promises as fs } from "fs";
import path from "path";
import type { Adapter } from "./adapter";
import {
  events,
  divisions,
  teams,
  players,
  fixtures,
  referees,
  editionAwards,
  partners,
  galleryImages,
} from "@/data/seed";
import { TABLES } from "./adapter";

const DB_PATH = path.join(process.cwd(), "data", ".db.json");

interface DbShape {
  tables: Record<string, unknown[]>;
  kv: Record<string, string>;
}

function seedShape(): DbShape {
  return {
    tables: {
      [TABLES.events]: events,
      [TABLES.divisions]: divisions,
      [TABLES.teams]: teams,
      [TABLES.players]: players,
      [TABLES.fixtures]: fixtures,
      [TABLES.referees]: referees,
      [TABLES.editionAwards]: editionAwards,
      [TABLES.partners]: partners,
      [TABLES.galleryImages]: galleryImages,
      [TABLES.contactSubmissions]: [],
      [TABLES.partnerEnquiries]: [],
      [TABLES.joinSubmissions]: [],
    },
    kv: {
      organizer_code: "LIGANATURAL2026",
    },
  };
}

// Serialize writes so concurrent requests in the same dev/single-instance
// process don't clobber each other.
let writeQueue: Promise<unknown> = Promise.resolve();
let cache: DbShape | null = null;

async function load(): Promise<DbShape> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    cache = JSON.parse(raw) as DbShape;
  } catch {
    cache = seedShape();
    await persist(cache);
  }
  return cache;
}

async function persist(db: DbShape): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function mutate<T>(fn: (db: DbShape) => T): Promise<T> {
  const run = writeQueue.then(async () => {
    const db = await load();
    const result = fn(db);
    cache = db;
    await persist(db);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

export class FileAdapter implements Adapter {
  async getAll<T>(table: string): Promise<T[]> {
    const db = await load();
    return (db.tables[table] as T[]) ?? [];
  }

  async getById<T>(table: string, id: string): Promise<T | null> {
    const rows = await this.getAll<T & { id: string }>(table);
    return rows.find((r) => r.id === id) ?? null;
  }

  async insert<T extends { id: string }>(table: string, row: T): Promise<T> {
    return mutate((db) => {
      if (!db.tables[table]) db.tables[table] = [];
      db.tables[table].push(row);
      return row;
    });
  }

  async update<T extends { id: string }>(table: string, id: string, patch: Partial<T>): Promise<T | null> {
    return mutate((db) => {
      const rows = (db.tables[table] as T[]) ?? [];
      const idx = rows.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      rows[idx] = { ...rows[idx], ...patch };
      return rows[idx];
    });
  }

  async remove(table: string, id: string): Promise<void> {
    await mutate((db) => {
      db.tables[table] = ((db.tables[table] as { id: string }[]) ?? []).filter((r) => r.id !== id);
    });
  }

  async getKV(key: string): Promise<string | null> {
    const db = await load();
    return db.kv[key] ?? null;
  }

  async setKV(key: string, value: string): Promise<void> {
    await mutate((db) => {
      db.kv[key] = value;
    });
  }
}
