// apiClient.ts
// Central fetch wrapper that automatically attaches the Keycloak Bearer token.
// Uses native fetch — no axios required.

import keycloak from "../auth/keycloak";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8081";

/** Refreshes the token if it expires in < 30s, then returns a valid Bearer header. */
async function authHeaders(): Promise<HeadersInit> {
  try {
    // Refresh token if it expires within 30 seconds
    await keycloak.updateToken(30);
  } catch {
    // Token refresh failed — redirect to login
    keycloak.login();
    throw new Error("Session expired. Redirecting to login.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${keycloak.token}`,
  };
}

/** Performs an authenticated GET request. */
export async function apiGet<T>(path: string): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}${path}`, { method: "GET", headers });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status} ${res.statusText}`);
  return res.json();
}

/** Performs an authenticated POST request. */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status} ${res.statusText}`);
  return res.json();
}

/** Performs an authenticated PUT request. */
export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} → ${res.status} ${res.statusText}`);
  return res.json();
}

/** Performs an authenticated PATCH request. */
export async function apiPatch<T>(path: string): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}${path}`, { method: "PATCH", headers });
  if (!res.ok) throw new Error(`PATCH ${path} → ${res.status} ${res.statusText}`);
  return res.json();
}
