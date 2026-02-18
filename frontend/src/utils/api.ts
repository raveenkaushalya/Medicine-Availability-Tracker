
const BASE_URL = (_path: string) => {
  // Always use Spring Boot default port
  return 'http://localhost:8080';
};


export async function apiFetch(path: string, options: RequestInit = {}) {
  const base = BASE_URL(path);
  const res = await fetch(base + path, {
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
