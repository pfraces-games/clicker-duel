import { useUser } from '../state/appStateHooks';
import Header from './Header/Header';
import './AppLayout.css';

export default function AppLayout({ children }) {
  const { user } = useUser();

  return (
    <div className="AppLayout">
      <Header user={user} />

      <div className="page-container">{children}</div>
    </div>
  );
}
