/** MyAdoptions.jsx — list adoptions with populated dog & chosen foods */
import { useEffect, useState } from 'react';
import * as api from '../api.js';
import Guard from '../components/Guard.jsx';
import Loader from '../components/Loader.jsx';

export default function MyAdoptions(){ return <Guard><Inner/></Guard>; }
function Inner(){
  const [loading,setLoading]=useState(true);
  const [data,setData]=useState({items:[]});
  useEffect(()=>{ (async()=>{ setLoading(true); setData(await api.get('/adoptions/mine')); setLoading(false); })() },[]);
  if (loading) return <Loader/>;
  return (
    <div className="container">
      <div className="panel">
        <h2>My Adoptions</h2>
        <div className="grid cards">
          {data.items.map(a=>(
            <div key={a._id} className="card">
              <div className="badge">Adopted</div>
              <h3>{a.dogId?.name}</h3>
              <p>{a.thankYouMessage}</p>
              <div>
                <strong>Food:</strong>
                <ul>
                  {a.foodSelection?.length? a.foodSelection.map(i=>(
                    <li key={i._id}>{i.foodId?.name} × {i.qty}</li>
                  )) : <li>None</li>}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
