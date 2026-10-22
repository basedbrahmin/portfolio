export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export const cvUrl = (format) => `${API_URL}/api/cv/${format}`;

export async function fetchContent() {
  const res = await fetch(`${API_URL}/api/content`);
  if (!res.ok) throw new Error(`Content request failed (${res.status})`);
  return res.json();
}

export async function sendMessage(data) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || 'Something went wrong. Please try again.');
    err.fields = body.errors;
    throw err;
  }
  return body;
}
