import { useState, useEffect } from "react";
import { ref, onValue, set, push } from "firebase/database";
import { db } from "../../db";
import { mapObject } from "../../lib";

export default function PlayerList({ user }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const playersRef = ref(db, "players");

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

  const onPlayerClick = (player) => {
    const roomsRef = ref(db, "rooms");
    const roomRef = push(roomsRef);
    const roomPlayersRef = ref(db, `rooms/${roomRef.key}/players`);
    const userRef = ref(db, `players/${user.key}`);
    const playerRef = ref(db, `players/${player.key}`);

    const newUser = { ...user, room: roomRef.key };
    const newPlayer = { ...player, room: roomRef.key };

    set(userRef, newUser);
    set(playerRef, newPlayer);

    set(roomPlayersRef, {
      [user.key]: newUser,
      [player.key]: newPlayer
    });
  };

  return (
    <div className="PlayerList">
      <h3>Players</h3>
      <div className="list">
        {players.map((player) => (
          <button
            key={player.key}
            onClick={() => {
              onPlayerClick(player);
            }}
          >
            {player.name}
          </button>
        ))}
      </div>
    </div>
  );
}
