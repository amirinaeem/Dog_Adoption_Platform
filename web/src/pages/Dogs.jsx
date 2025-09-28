/** Dogs.jsx — public (or semi-public) list of all dogs with status filter */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api.js';
import Loader from '../components/Loader.jsx';

export default function Dogs(){
  const [loading,setLoading]=useState(true);
  const [data,setData]=useState({items:[]});
  const [status,setStatus]=useState('');

  useEffect(()=>{ (async()=>{
    setLoading(true);
    const q = status ? `?status=${status}` : '';
    setData(await api.get(`/dogs${q}`));
    setLoading(false);
  })() },[status]);

  if (loading) return <Loader/>;
  return (
    <div className="container">
      <div className="panel">
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <h2 style={{margin:0}}>All Dogs</h2>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={{maxWidth:200}}>
            <option value="">All</option><option value="PENDING">Pending</option><option value="ADOPTED">Adopted</option>
          </select>
        </div>
        <div className="grid cards" style={{marginTop:12}}>
          {data.items?.map(d=>(
            <div key={d._id} className="card">
              <div className="badge">{d.status}</div>
              <h3 style={{margin:'6px 0'}}>{d.name}</h3>
              <div className="kv"><span className="k">Owner</span><span className="v">{d.ownerId?.slice?.(0,6)}…</span></div>
              <p style={{opacity:.9}}>{d.description}</p>
              <div style={{display:'flex',gap:8}}>
                <Link className="btn secondary" to={`/dogs/${d._id}`}>Details</Link>
                {d.status==='PENDING' && <Link className="btn" to={`/adopt/${d._id}`}>Adopt</Link>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
