/** DogDetail.jsx — view single dog */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../api.js';
import Loader from '../components/Loader.jsx';

export default function DogDetail(){
  const { id } = useParams();
  const [loading,setLoading]=useState(true);
  const [dog,setDog]=useState(null);

  useEffect(()=>{ (async()=>{ setLoading(true); const d=await api.get(`/dogs/${id}`); setDog(d.error?null:d); setLoading(false); })() },[id]);
  if (loading) return <Loader/>;
  if (!dog) return <div className="container"><div className="panel">Not found.</div></div>;
  return (
    <div className="container">
      <div className="panel">
        <div className="badge">{dog.status}</div>
        <h2>{dog.name}</h2>
        <div className="kv"><span className="k">Owner</span><span>{dog.ownerId}</span></div>
        <p style={{marginTop:8}}>{dog.description}</p>
        {dog.status==='PENDING' && <Link className="btn" to={`/adopt/${dog._id}`}>Adopt</Link>}
      </div>
    </div>
  );
}
