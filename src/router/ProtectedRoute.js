import { Navigate } from 'react-router-dom';
import { useUser } from '../state/appStateHooks';

export default function ProtectedRoute({ children }) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
