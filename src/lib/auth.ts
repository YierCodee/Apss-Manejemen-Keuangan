// src/lib/auth.ts
//
// JWT session management using httpOnly cookies.
// Uses jose for edge-compatible JWT signing/verification.

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "./permissions";

const SESSION_COOKIE = "session-token";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production",
);

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: Role;
  lastActivity: number;
};

/**
 * Create a signed JWT session and set it as an httpOnly cookie.
 */
export async function createSession(
  payload: SessionPayload,
  rememberMe?: boolean,
): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(rememberMe ? "30d" : "24h")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
  });
}

/**
 * Refresh session by updating lastActivity timestamp.
 * Preserves all existing session data, only updates lastActivity.
 */
export async function refreshSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const sessionPayload = payload as unknown as SessionPayload;

    // Create new token with updated lastActivity
    const newToken = await new SignJWT({ ...sessionPayload, lastActivity: Date.now() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(
        // Preserve original expiry by calculating remaining time
        new Date((payload.exp as number) * 1000),
      )
      .sign(JWT_SECRET);

    cookieStore.set(SESSION_COOKIE, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // Preserve original maxAge based on original expiry
      maxAge: Math.floor(((payload.exp as number) * 1000 - Date.now()) / 1000),
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Verify the JWT from the session cookie and return the payload.
 * Returns null if no session exists or the token is invalid.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Destroy the session by clearing the cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
