const BASE_URL = "http://localhost:8080";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
