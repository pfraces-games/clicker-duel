import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../db';
import { mapObject } from '../../lib';

export default function RoomList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const roomsRef = ref(db, 'rooms');

    onValue(roomsRef, (data) => {
      const snapshot = data.val();

      if (snapshot == null) {
        return;
      }

      setRooms(mapObject(snapshot, (value, key) => ({ ...value, key })));
    });
  }, []);

  return (
    <div className="RoomList">
      <h3>Rooms</h3>
      <div className="list">
        {rooms.map((room) => (
          <pre key={room.key}>
            {JSON.stringify(mapObject(room.stats, ({ name }) => name))}
          </pre>
        ))}
      </div>
    </div>
  );
}
