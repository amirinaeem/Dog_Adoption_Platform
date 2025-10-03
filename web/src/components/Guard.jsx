// src/components/Guard.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthed } from '../auth.jsx';

export default function Guard({ children }) {
  const location = useLocation();
  return isAuthed()
    ? children
    : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
