import { cookies } from "next/headers";
import type { Session } from "./types";

export const SESSION_COOKIE = "ln_session";

function secret(): string {
  // Not fatal — this is a low-sensitivity access-code system, not a
  // password vault — but production deployments should set a real secret.
  return process.env.SESSION_SECRET || "liga-natural-dev-secret-change-me";
}

function toBase64Url(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  const bin = atob(padded);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder().encode(secret());
  return crypto.subtle.importKey("raw", enc, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function sign(payload: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toBase64Url(sig);
}

async function verify(payload: string, sig: string): Promise<boolean> {
  const key = await getKey();
  try {
    const sigBytes = fromBase64Url(sig);
    const sigBuffer = sigBytes.buffer.slice(sigBytes.byteOffset, sigBytes.byteOffset + sigBytes.byteLength) as ArrayBuffer;
    return await crypto.subtle.verify("HMAC", key, sigBuffer, new TextEncoder().encode(payload));
  } catch {
    return false;
  }
}

function toBase64UrlString(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const bin = String.fromCharCode(...bytes);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64UrlString(str: string): string {
  const bytes = fromBase64Url(str);
  return new TextDecoder().decode(bytes);
}

export async function encodeSession(session: Session): Promise<string> {
  const payload = toBase64UrlString(JSON.stringify(session));
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function decodeSession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const ok = await verify(payload, sig);
  if (!ok) return null;
  try {
    return JSON.parse(fromBase64UrlString(payload)) as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie(session: Session): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, await encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
