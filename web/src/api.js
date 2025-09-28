/** api.js — tiny fetch wrapper that injects JWT and handles JSON */
const BASE = import.meta.env.VITE_API_BASE;


console.log(import.meta.env.VITE_API_BASE)

function headers() {
  const h = { 'content-type': 'application/json' };
  const tok = localStorage.getItem('token');
  if (tok) h.authorization = `Bearer ${tok}`;
  return h;
}

export async function get(path) {
  const r = await fetch(`${BASE}${path}`, { headers: headers() });
  return r.json();
}
export async function post(path, body) {
  const r = await fetch(`${BASE}${path}`, { method:'POST', headers: headers(), body: JSON.stringify(body) });
  return r.json();
}
export async function del(path) {
  const r = await fetch(`${BASE}${path}`, { method:'DELETE', headers: headers() });
  return r.json();
}
