/** Register.jsx — user registration form */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../api.js';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    
    try {
      const r = await api.post('/auth/register', form);
      if (r.error) {
        setErr(r.error);
      } else {
        navigate('/login');
      }
    } catch (error) {
      setErr('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="panel">
        <h2>Create Account</h2>
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
              minLength={3}
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
              minLength={6}
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}