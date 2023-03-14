import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, push } from 'firebase/database';
import { useUser } from '../../state/appStateHooks';
import { db } from '../../db';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [userName, setUserName] = useState('');

  const onLogin = (userName) => {
    const playersRef = ref(db, 'players');
    const userRef = push(playersRef);
    const loggedUser = { name: userName, key: userRef.key };
    set(userRef, loggedUser);
    setUser(() => loggedUser);
    navigate('/');
  };

  return (
    <div className="Login">
      <h2>Login</h2>
      Name:{' '}
      <input
        type="text"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      />
      <button
        onClick={() => {
          onLogin(userName);
        }}
      >
        Login
      </button>
    </div>
  );
}
