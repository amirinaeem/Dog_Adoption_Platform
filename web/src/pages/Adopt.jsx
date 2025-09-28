/** Adopt.jsx — adoption flow: confirm + choose food selection */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api.js';
import Guard from '../components/Guard.jsx';
import Loader from '../components/Loader.jsx';

export default function Adopt(){ return <Guard><Inner/></Guard>; }

function Inner(){
  const nav = useNavigate();
  const { id } = useParams();
  const [dog,setDog]=useState(null);
  const [foods,setFoods]=useState([]);
  const [loading,setLoading]=useState(true);
  const [thanks,setThanks]=useState('Thank you for helping!');
  const [basket,setBasket]=useState([]); // [{foodId, qty}]
  const [err,setErr]=useState('');

  useEffect(()=>{ (async()=>{
    setLoading(true);
    const d=await api.get(`/dogs/${id}`); const f=await api.get('/foods');
    setDog(d.error?null:d); setFoods(f); setLoading(false);
  })() },[id]);

  function setQty(foodId, qty){
    const q = Math.max(0, Number(qty)||0);
    const found = basket.find(x=>x.foodId===foodId);
    if (!found && q>0) setBasket([...basket,{foodId,qty:q}]);
    else if (found && q>0) setBasket(basket.map(x=>x.foodId===foodId?{...x,qty:q}:x));
    else if (found && q===0) setBasket(basket.filter(x=>x.foodId!==foodId));
  }

  async function adopt(){
    setErr('');
    const r=await api.post(`/adoptions/${id}`, { thankYouMessage: thanks, foodSelection: basket });
    if (r.error) setErr(r.error); else nav('/adoptions');
  }

  if (loading) return <Loader/>;
  if (!dog) return <div className="container"><div className="panel">Dog not found.</div></div>;

  return (
    <div className="container">
      <div className="panel">
        <h2>Adopt: {dog.name}</h2>
        <p>{dog.description}</p>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div>
            <label>Thank-you message to owner</label>
            <textarea value={thanks} onChange={e=>setThanks(e.target.value)} rows={4}/>
          </div>
          <div>
            <label>Select Food (optional)</label>
            <div className="grid">
              {foods.map(f=>(
                <div key={f._id} className="kv">
                  <span className="k">{f.name} <span className="badge">stock {f.stock}</span></span>
                  <input type="number" min="0" placeholder="0"
                    onChange={e=>setQty(f._id, e.target.value)} style={{maxWidth:120}}/>
                </div>
              ))}
            </div>
          </div>
        </div>
        {err && <div className="badge" style={{background:'#5d1f1f',marginTop:10}}>⚠ {err}</div>}
        <button className="btn" onClick={adopt} style={{marginTop:12}}>Confirm Adoption</button>
      </div>
    </div>
  );
}
