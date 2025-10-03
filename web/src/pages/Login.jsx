/** Login.jsx — login form that stores token+user */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api.js';
import { setAuth } from '../auth.jsx';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    
    try {
      const r = await api.post('/auth/login', form);
      if (r.error) {
        setErr(r.error);
      } else {
        setAuth(r.token, r.user);
        navigate('/');
      }
    } catch (error) {
      setErr('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="panel">
        <h2>Login</h2>
        <form onSubmit={submit} className="grid">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          {err && (
            <div className="error-message">
              ⚠ {err}
            </div>
          )}
          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
      </div>
    </div>
  );
}