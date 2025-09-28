/** Register.jsx — user registration form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api.js';

export default function Register(){
  const nav = useNavigate();
  const [form, setForm] = useState({ username:'', password:'' });
  const [err, setErr] = useState('');
  const submit = async (e)=> {
    e.preventDefault(); setErr('');
    const r = await api.post('/auth/register', form);
    if (r.error) setErr(r.error); else nav('/login');
  };
  return (
    <div className="container">
      <div className="panel">
        <h2>Create account</h2>
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
          <button className="btn">Register</button>
        </form>
      </div>
    </div>
  );
}
