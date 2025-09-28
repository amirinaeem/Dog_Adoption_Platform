/** auth.jsx — simple auth helpers (token + user in localStorage) */
export function setAuth(token, user){ localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); }
export function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); }
export function me(){ try{ return JSON.parse(localStorage.getItem('user')||'null'); }catch{ return null; } }
export function isAuthed(){ return !!localStorage.getItem('token'); }
