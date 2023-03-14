import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ user }) {
  return (
    <div className="Header">
      <div className="page-container">
        <h3>
          <Link to={'/rooms'}>Clicker Duel</Link>
        </h3>
        <h4>{user?.name}</h4>
      </div>
    </div>
  );
}
