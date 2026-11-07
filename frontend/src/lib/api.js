// Talks to the Laravel API. In dev, Vite forwards /api to http://127.0.0.1:8000.
// For a separate production host, set VITE_API_URL (e.g. https://example.com/api).
const BASE = import.meta.env.VITE_API_URL ?? "/api";
const TOKEN_KEY = "abc.token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Can't reach the server. Start MySQL in XAMPP and run php artisan serve.",
      0
    );
  }

  if (res.status === 401 && token) {
    window.dispatchEvent(new Event("abc:unauthorized"));
  }
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const firstError = data?.errors ? Object.values(data.errors)[0]?.[0] : null;
    throw new ApiError(firstError || data?.message || "Something went wrong. Try again.", res.status);
  }
  return data;
}
