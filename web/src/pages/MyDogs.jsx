/** MyDogs.jsx — manage own dogs: create + list + delete (if not adopted) */
import { useEffect, useState } from 'react';
import * as api from '../api.js';
import Guard from '../components/Guard.jsx';
import Loader from '../components/Loader.jsx';
import { Link } from "react-router-dom";


export default function MyDogs(){
  return <Guard><Inner/></Guard>;
}
function Inner(){
  const [loading,setLoading]=useState(true);
  const [list,setList]=useState({items:[]});
  const [form,setForm]=useState({name:'',description:''});
  const [err,setErr]=useState('');

  async function load(){ setLoading(true); setList(await api.get('/dogs/mine')); setLoading(false); }
  useEffect(()=>{ load(); },[]);

  async function create(e){ e.preventDefault(); setErr(''); const r=await api.post('/dogs',form);
    if(r.error) setErr(r.error); else{ setForm({name:'',description:''}); load(); } }
  async function remove(id){ const ok=confirm('Remove this dog?'); if(!ok) return;
    const r=await api.del(`/dogs/${id}`); if(r.error) alert(r.error); load(); }

  if (loading) return <Loader/>;
  return (
    <div className="container">
      <div className="panel">
        <h2>My Dogs</h2>
        <form onSubmit={create} className="grid" style={{gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div><label>Description</label><input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          {err && <div className="badge" style={{background:'#5d1f1f',gridColumn:'1/-1'}}>⚠ {err}</div>}
          <div style={{gridColumn:'1/-1'}}><button className="btn">Add</button></div>
        </form>

        <div className="grid cards">
          {list.items?.map(d=>(
            <div key={d._id} className="card">
              <div className="badge">{d.status}</div>
              <h3 style={{margin:'6px 0'}}>{d.name}</h3>
              <p style={{opacity:.9}}>{d.description}</p>
              <div style={{display:'flex',gap:8}}>
                <Link className="btn secondary" to={`/dogs/${d._id}`}>Details</Link>
                {d.status==='PENDING' && <button className="btn danger" onClick={()=>remove(d._id)}>Remove</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
