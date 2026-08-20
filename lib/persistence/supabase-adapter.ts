import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Adapter } from "./adapter";
import { objectToCamel, objectToSnake } from "./case";

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

const KV_TABLE = "app_settings";

export class SupabaseAdapter implements Adapter {
  async getAll<T>(table: string): Promise<T[]> {
    const { data, error } = await getClient().from(table).select("*");
    if (error) throw new Error(`[supabase] getAll ${table}: ${error.message}`);
    return (data ?? []).map((row) => objectToCamel<T>(row));
  }

  async getById<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await getClient().from(table).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`[supabase] getById ${table}: ${error.message}`);
    return data ? objectToCamel<T>(data) : null;
  }

  async insert<T extends { id: string }>(table: string, row: T): Promise<T> {
    const { data, error } = await getClient()
      .from(table)
      .insert(objectToSnake(row as unknown as Record<string, unknown>))
      .select()
      .single();
    if (error) throw new Error(`[supabase] insert ${table}: ${error.message}`);
    return objectToCamel<T>(data);
  }

  async update<T extends { id: string }>(table: string, id: string, patch: Partial<T>): Promise<T | null> {
    const { data, error } = await getClient()
      .from(table)
      .update(objectToSnake(patch as Record<string, unknown>))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(`[supabase] update ${table}: ${error.message}`);
    return data ? objectToCamel<T>(data) : null;
  }

  async remove(table: string, id: string): Promise<void> {
    const { error } = await getClient().from(table).delete().eq("id", id);
    if (error) throw new Error(`[supabase] remove ${table}: ${error.message}`);
  }

  async getKV(key: string): Promise<string | null> {
    const { data, error } = await getClient().from(KV_TABLE).select("value").eq("key", key).maybeSingle();
    if (error) throw new Error(`[supabase] getKV ${key}: ${error.message}`);
    return data?.value ?? null;
  }

  async setKV(key: string, value: string): Promise<void> {
    const { error } = await getClient().from(KV_TABLE).upsert({ key, value });
    if (error) throw new Error(`[supabase] setKV ${key}: ${error.message}`);
  }
}
