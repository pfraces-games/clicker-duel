import { useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../../db";
import PlayerList from "./PlayerList";
import RoomList from "./RoomList";
import "./Rooms.css";

export default function Rooms({ user, onRoom }) {
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
