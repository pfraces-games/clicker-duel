import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push, set, off, onChildAdded, onValue } from 'firebase/database';
import { useUser } from '../../state/appStateHooks';
import { db } from '../../db';
import Game from './Game';
import Combatlog from './Combatlog';
import { joinRoom } from './room.model';
import './Room.css';

/**
 * Room view component
 *
 * Data syncronization between clients and db is powered by the
 * Firebase Realtime Database. The approach used is the following:
 *
 * - User state is updated based on user actions and opponent attacks, then
 *   the changes are pushed to the db.
 * - Opponent state is updated based on db events.
 * - Attacks are pushed to the db as combatlog entries.
 * - When an attack from the opponent is received the user HP is reduced,
 *   then the changes are pushed to db.
 *
 * This way, each user gets its own updates rendered without the network
 * latency and syncronization conflicts are avoided.
 */

export default function Room() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [userStats, setUserStats] = useState();
  const [opponentStats, setOpponentStats] = useState();
  const [combatlog, setCombatlog] = useState([]);

  const syncUserStats = (transform) => {
    setUserStats((prev) => {
      const newValue = transform(prev.value);
      set(prev.ref, newValue);
      return { ...prev, value: newValue };
    });
  };

  const onAttack = (sword) => {
    set(push(ref(db, `rooms/${user.room}/combatlog`)), {
      player: userStats.ref.key,
      type: 'attack',
      sword,
    });
  };

  const onBack = () => {
    set(ref(db, `players/${user.key}`), { ...user, room: null });
    navigate('/rooms');
  };

  // Init db room with initial user stats, the opponent client will do the same.

  useEffect(() => {
    joinRoom(user);
  }, []);

  // Listen for players to enter the room.
  //
  // - When a player is received check wether it's the user or the opponent.
  // - Update react stats state for both players.
  // - Listen for opponent stats changes to update its react state.

  useEffect(() => {
    const roomStatsRef = ref(db, `rooms/${user.room}/stats`);

    onChildAdded(roomStatsRef, (data) => {
      const playerStatsRef = ref(db, `rooms/${user.room}/stats/${data.key}`);

      if (data.key === user.key) {
        setUserStats({ ref: playerStatsRef, value: data.val() });
      } else {
        setOpponentStats({ ref: playerStatsRef, value: data.val() });

        onValue(playerStatsRef, (data) => {
          setOpponentStats((prev) => ({ ...prev, value: data.val() }));
        });
      }
    });

    return () => {
      off(roomStatsRef);

      if (opponentStats?.ref) {
        off(opponentStats.ref);
      }
    };
  }, []);

  // Listen for opponent attacks
  //
  // - When an attack from the opponent is received reduce user HP.
  // - [TODO] Push updated HP to the db.

  useEffect(() => {
    const combatlogRef = ref(db, `rooms/${user.room}/combatlog`);

    onChildAdded(combatlogRef, (data) => {
      const logEntry = data.val();

      if (logEntry == null) {
        return;
      }

      setCombatlog((prev) => [...prev, logEntry]);

      const { player, type, ...entry } = logEntry;

      // Ignore own events
      if (player === userStats.ref.key) {
        return;
      }

      if (type === 'attack') {
        syncUserStats((prev) => {
          const opponentSword = entry.sword;
          const userShield = prev.shield;
          const attackRatio = opponentSword / (opponentSword + userShield);
          const damage = attackRatio * opponentSword;

          return {
            ...prev,
            hp: Math.max(prev.hp - damage, 0),
          };
        });
      }
    });

    return () => {
      off(combatlogRef);
    };
  }, [user.room, userStats?.ref?.key]);

  if (!userStats || !opponentStats) {
    return 'Waiting for players...';
  }

  return (
    <div className="Room">
      <Game
        self={userStats.value}
        setSelf={syncUserStats}
        enemy={opponentStats.value}
        onAttack={onAttack}
        onBack={onBack}
      />

      <Combatlog events={combatlog} />
    </div>
  );
}
