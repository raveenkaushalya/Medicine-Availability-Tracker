


const BASE_URL = () => {
  // Use environment variable for backend URL, fallback to localhost for dev
  const url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  return url.replace(/\/+$/, ''); // Remove trailing slash
};



export async function apiFetch(path: string, options: RequestInit = {}) {
  const base = BASE_URL();
  // Ensure path starts with a single slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = base + normalizedPath;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  let data;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  if (!res.ok) throw data;
  return data;
}
