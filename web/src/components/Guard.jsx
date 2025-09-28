/** Guard.jsx — route guard for authed-only pages */
import { Navigate } from 'react-router-dom';
import { isAuthed } from '../auth.jsx';
export default function Guard({ children }){ return isAuthed() ? children : <Navigate to="/login" replace />; }
