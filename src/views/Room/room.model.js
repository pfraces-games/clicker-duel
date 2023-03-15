import { ref, set } from 'firebase/database';
import { db } from '../../db';

const initStats = () => ({
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

export const joinRoom = (user) => {
  set(ref(db, `rooms/${user.room}/players/${user.key}`), { name: user.name });
  set(ref(db, `rooms/${user.room}/stats/${user.key}`), initStats());
};
