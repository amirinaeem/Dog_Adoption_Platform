/** Login.jsx — login form that stores token+user */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api.js';
import { setAuth } from '../auth.jsx';

export default function Login(){
  const nav = useNavigate();
  const [form, setForm] = useState({ username:'', password:'' });
  const [err, setErr] = useState('');
  const submit = async (e)=> {
    e.preventDefault(); setErr('');
    const r = await api.post('/auth/login', form);
    if (r.error) setErr(r.error);
    else { setAuth(r.token, r.user); nav('/'); }
  };
  return (
    <div className="container">
      <div className="panel">
        <h2>Login</h2>
        <form onSubmit={submit} className="grid">
          <div>
            <label>Username</label>
            <input value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/>
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
          </div>
          {err && <div className="badge" style={{background:'#5d1f1f'}}>⚠ {err}</div>}
          <button className="btn">Login</button>
        </form>
      </div>
    </div>
  );
}
