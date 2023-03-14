import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, off } from 'firebase/database';
import { useUser } from '../../state/appStateHooks';
import { db } from '../../db';
import PlayerList from './PlayerList';
import RoomList from './RoomList';
import './Rooms.css';

export default function Rooms() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const onRoom = (room) => {
    setUser((x) => ({ ...x, room }));
    navigate(`/rooms/${room}`);
  };

  useEffect(() => {
    const userRef = ref(db, `players/${user.key}`);

    onValue(userRef, (data) => {
      const snapshot = data.val();

      if (snapshot == null) {
        return;
      }

      if (snapshot.room) {
        onRoom(snapshot.room);
      }
    });

    return () => {
      off(userRef);
    };
  }, []);

  return (
    <div className="Rooms">
      <PlayerList user={user} />
      <RoomList />
    </div>
  );
}
