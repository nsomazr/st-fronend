import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminEntry() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/admin/dashboard' : '/admin/login'} replace />;
}
