import { useState, useEffect } from 'react';
import { ref, onValue, set, push } from 'firebase/database';
import { db } from '../../db';
import { mapObject } from '../../lib';

export default function PlayerList({ user }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const playersRef = ref(db, 'players');

    onValue(playersRef, (data) => {
      const snapshot = data.val();

      if (snapshot == null) {
        return;
      }

      setPlayers(
        mapObject(snapshot, (value, key) => ({ key, ...value }))
          .filter((value) => value.key !== user.key)
          .filter((value) => !value.room)
      );
    });
  }, []);

  const selectOpponent = (opponent) => {
    const roomsRef = ref(db, 'rooms');
    const roomRef = push(roomsRef);

    const userRef = ref(db, `players/${user.key}`);
    const opponentRef = ref(db, `players/${opponent.key}`);

    set(userRef, { ...user, room: roomRef.key });
    set(opponentRef, { ...opponent, room: roomRef.key });
  };

  return (
    <div className="PlayerList">
      <h3>Players</h3>
      <div className="list">
        {players.map((player) => (
          <button
            key={player.key}
            onClick={() => {
              selectOpponent(player);
            }}
          >
            {player.name}
          </button>
        ))}
      </div>
    </div>
  );
}
