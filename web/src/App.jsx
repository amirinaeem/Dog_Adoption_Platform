/** App.jsx — React Router routes + header */
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dogs from './pages/Dogs.jsx';
import MyDogs from './pages/MyDogs.jsx';
import DogDetail from './pages/DogDetail.jsx';
import Adopt from './pages/Adopt.jsx';
import Foods from './pages/Foods.jsx';
import MyAdoptions from './pages/MyAdoptions.jsx';

export default function App(){
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dogs" element={<Dogs/>}/>
        <Route path="/dogs/:id" element={<DogDetail/>}/>
        <Route path="/my-dogs" element={<MyDogs/>}/>
        <Route path="/adopt/:id" element={<Adopt/>}/>
        <Route path="/foods" element={<Foods/>}/>
        <Route path="/adoptions" element={<MyAdoptions/>}/>
        <Route path="*" element={<Navigate to="/" replace />}/>
      </Routes>
    </>
  );
}
