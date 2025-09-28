/** Foods.jsx — list + add food (authed users) */
import { useEffect, useState } from 'react';
import * as api from '../api.js';
import Guard from '../components/Guard.jsx';
import Loader from '../components/Loader.jsx';

export default function Foods(){ return <Guard><Inner/></Guard>; }

function Inner(){
  const [list,setList]=useState([]);
  const [loading,setLoading]=useState(true);
  const [form,setForm]=useState({name:'',brand:'',stock:0,notes:''});
  const [err,setErr]=useState('');

  async function load(){ setLoading(true); setList(await api.get('/foods')); setLoading(false); }
  useEffect(()=>{ load(); },[]);
  async function create(e){ e.preventDefault(); setErr(''); const r=await api.post('/foods',form);
    if(r.error) setErr(r.error); else { setForm({name:'',brand:'',stock:0,notes:''}); load(); } }

  if (loading) return <Loader/>;
  return (
    <div className="container">
      <div className="panel">
        <h2>Food Bank</h2>
        <form onSubmit={create} className="grid">
          <div><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div><label>Brand</label><input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}/></div>
          <div><label>Stock</label><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:Number(e.target.value)||0})}/></div>
          <div><label>Notes</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
          {err && <div className="badge" style={{background:'#5d1f1f'}}>⚠ {err}</div>}
          <button className="btn">Add Food</button>
        </form>
        <table className="table" style={{marginTop:12}}>
          <thead><tr><th>Name</th><th>Brand</th><th>Stock</th><th>Notes</th></tr></thead>
          <tbody>{list.map(f=> (<tr key={f._id}><td>{f.name}</td><td>{f.brand||'-'}</td><td>{f.stock}</td><td>{f.notes||'-'}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
