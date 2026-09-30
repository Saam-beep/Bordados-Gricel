import { Navigate } from 'react-router-dom';
export default function ProtectedRoute({ children, admin = false }) {
  const user = JSON.parse(localStorage.getItem('gricel_user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role === 'CLIENT') return <Navigate to="/portal" replace />;
  return children;
}
