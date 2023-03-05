import "./Header.css";

export default function Header({ user }) {
  return (
    <div className="Header">
      <div className="page-container">
        <h3>Clicker Duel</h3>
        <h4>{user?.name}</h4>
      </div>
    </div>
  );
}
