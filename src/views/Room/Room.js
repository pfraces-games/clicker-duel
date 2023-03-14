import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push, set, off, onChildAdded, onValue } from 'firebase/database';
import { useUser } from '../../state/appStateHooks';
import { db } from '../../db';
import Game from './Game';
import Combatlog from './Combatlog';
import './Room.css';

const initPlayer = () => ({
  wood: 100,
  ore: 100,
  food: 100,
  hp: 300,
  maxHp: 300,
  axe: 1,
  axeXp: 0,
  pick: 1,
  pickXp: 0,
  hoe: 1,
  hoeXp: 0,
  knife: 1,
  knifeXp: 0,
  sword: 1,
  swordXp: 0,
  shield: 1,
  shieldXp: 0,
});

export default function Room() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [self, setSelf] = useState();
  const [enemy, setEnemy] = useState();
  const [combatlog, setCombatlog] = useState([]);

  const [selfRef, setSelfRef] = useState();
  const [enemyRef, setEnemyRef] = useState();

  useEffect(() => {
    const roomStatsRef = ref(db, `rooms/${user.room}/stats`);
    const userStatsRef = ref(db, `rooms/${user.room}/stats/${user.key}`);
    set(userStatsRef, { name: user.name, ...initPlayer() });

    onChildAdded(roomStatsRef, (data) => {
      const childRef = ref(db, `rooms/${user.room}/stats/${data.key}`);

      if (data.key === user.key) {
        setSelf(data.val());
        setSelfRef(childRef);
      } else {
        setEnemy(data.val());
        setEnemyRef(childRef);

        onValue(childRef, (data) => {
          setEnemy(data.val());
        });
      }
    });

    return () => {
      off(roomStatsRef);
    };
  }, []);

  useEffect(() => {
    const combatlogRef = ref(db, `rooms/${user.room}/combatlog`);

    onChildAdded(combatlogRef, (data) => {
      const value = data.val();

      if (value == null) {
        return;
      }

      if (value.player === enemyRef.key) {
        setSelf((x) => ({ ...x, hp: Math.max(x.hp - value.damage, 0) }));
      }

      setCombatlog((x) => [...x, value]);
    });

    return () => {
      off(combatlogRef);
    };
  }, [enemyRef]);

  const sync = (setter, dbRef) => (transform) => {
    setter((prevValue) => {
      const newValue = transform(prevValue);
      set(dbRef, newValue);
      return newValue;
    });
  };

  const onAttack = (damage) => {
    const combatlogRef = ref(db, `rooms/${user.room}/combatlog`);
    const newEntryRef = push(combatlogRef);
    set(newEntryRef, { player: selfRef.key, damage });
  };

  if (!self || !enemy) {
    return 'Waiting for players...';
  }

  const onBack = () => {
    const userRef = ref(db, `players/${user.key}`);
    set(userRef, { ...user, room: null });
    navigate('/rooms');
  };

  return (
    <div className="Room">
      <Game
        self={self}
        setSelf={sync(setSelf, selfRef)}
        enemy={enemy}
        setEnemy={sync(setEnemy, enemyRef)}
        onAttack={onAttack}
        onBack={onBack}
      />

      <Combatlog events={combatlog} />
    </div>
  );
}
