/** api.js — tiny fetch wrapper that injects JWT and handles JSON */

// Use environment variable or default to local development
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

console.log('API Base URL:', BASE);

function headers() {
  const h = { 'Content-Type': 'application/json' };
  const tok = localStorage.getItem('token');
  if (tok) h.Authorization = `Bearer ${tok}`;
  return h;
}

async function handleResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  
  return data;
}

export async function get(path) {
  try {
    const response = await fetch(`${BASE}${path}`, { 
      headers: headers(),
      credentials: 'include'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('GET request failed:', error);
    return { error: error.message };
  }
}

export async function post(path, body) {
  try {
    const response = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
      credentials: 'include'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('POST request failed:', error);
    return { error: error.message };
  }
}

export async function del(path) {
  try {
    const response = await fetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: headers(),
      credentials: 'include'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('DELETE request failed:', error);
    return { error: error.message };
  }
}