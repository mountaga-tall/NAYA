import { cookies, headers } from "next/headers";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import prisma from "@/lib/prisma";

const scryptAsync = promisify(scrypt);

export const SESSION_COOKIE = "naya_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type RateLimitEntry = {
  failures: number;
  blockedUntil: number;
};

const loginRateLimit = new Map<string, RateLimitEntry>();
const MAX_LOGIN_FAILURES = 8;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_BLOCK_MS = 15 * 60 * 1000;

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host) return false;

  return origin === `https://${host}` || origin === `http://${host}`;
}

export function tooManyLoginAttempts(request: Request, email: string) {
  const key = `${clientAddress(request)}:${email}`;
  const entry = loginRateLimit.get(key);
  const now = Date.now();

  if (!entry) return { blocked: false, retryAfterSeconds: 0 };

  if (entry.blockedUntil > now) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  if (now - entry.blockedUntil > LOGIN_WINDOW_MS) {
    loginRateLimit.delete(key);
  }

  return { blocked: false, retryAfterSeconds: 0 };
}

export function recordLoginFailure(request: Request, email: string) {
  const key = `${clientAddress(request)}:${email}`;
  const now = Date.now();
  const current = loginRateLimit.get(key);

  if (!current || now - current.blockedUntil > LOGIN_WINDOW_MS) {
    loginRateLimit.set(key, { failures: 1, blockedUntil: now + LOGIN_WINDOW_MS });
    return;
  }

  const failures = current.failures + 1;
  loginRateLimit.set(key, {
    failures,
    blockedUntil: failures >= MAX_LOGIN_FAILURES ? now + LOGIN_BLOCK_MS : current.blockedUntil,
  });
}

export function clearLoginFailures(request: Request, email: string) {
  loginRateLimit.delete(`${clientAddress(request)}:${email}`);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = (await scryptAsync(password, salt, 64, {
    N: 16_384,
    r: 8,
    p: 1,
    maxmem: 32 * 1024 * 1024,
  })) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [salt, storedHex] = encoded.split(":");
  if (!salt || !storedHex) return false;

  const stored = Buffer.from(storedHex, "hex");
  if (stored.length !== 64) return false;

  const derivedKey = (await scryptAsync(password, salt, 64, {
    N: 16_384,
    r: 8,
    p: 1,
    maxmem: 32 * 1024 * 1024,
  })) as Buffer;

  return timingSafeEqual(stored, derivedKey);
}

export function normalizeEmail(email: unknown) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function isValidEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8 && password.length <= 128;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  await prisma.session.create({
    data: { tokenHash, userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return expiresAt;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { user: true },
  });

  if (!session) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return session.user;
}

export async function clearCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: { tokenHash: hashSessionToken(token) },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export function unauthorized() {
  return Response.json(
    { error: "Authentification requise." },
    {
      status: 401,
      headers: { "Cache-Control": "private, no-store" },
    }
  );
}

export async function serverOriginForLog() {
  const h = await headers();
  return h.get("host") || "";
}
