/** Header.jsx — top navigation bar */
import { Link, useNavigate } from 'react-router-dom';
import { isAuthed, me, logout } from '../auth.jsx';

export default function Header(){
  const nav = useNavigate();
  const user = me();
  return (
    <div className="nav">
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <Link to="/">🐶 Dog Adoption</Link>
        <Link to="/dogs">All Dogs</Link>
        {isAuthed() && <>
          <Link to="/my-dogs">My Dogs</Link>
          <Link to="/adoptions">My Adoptions</Link>
          <Link to="/foods">Food Bank</Link>
        </>}
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        {isAuthed()
          ? <>
              <span className="badge">Hello, {user?.username}</span>
              <button className="btn secondary" onClick={()=>{logout();nav('/');}}>Logout</button>
            </>
          : <>
              <Link className="btn secondary" to="/login">Login</Link>
              <Link className="btn" to="/register">Register</Link>
            </>
        }
      </div>
    </div>
  );
}
