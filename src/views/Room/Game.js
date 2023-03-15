import useThrottle from './useThrottle';
import useCountdown from './useCountdown';
import Tool from './Tool';

const config = {
  throttle: 200,
};

export default function Game({ self, setSelf, enemy, onAttack, onBack }) {
  const countdown = useCountdown(5);

  const forest = useThrottle(
    () => {
      setSelf((x) => ({
        ...x,
        wood: x.wood + x.axe,
      }));
    },
    config.throttle,
    []
  );

  const mountain = useThrottle(
    () => {
      setSelf((x) => ({
        ...x,
        ore: x.ore + x.pick,
      }));
    },
    config.throttle,
    []
  );

  const farm = useThrottle(
    () => {
      setSelf((x) => ({
        ...x,
        food: x.food + x.hoe,
      }));
    },
    config.throttle,
    []
  );

  const campfire = useThrottle(
    () => {
      setSelf((x) => {
        const hp = Math.round(x.hp);
        const incHp = hp + x.knife <= x.maxHp ? x.knife : x.maxHp - hp;
        const incFood = x.food - x.knife <= 0 ? x.food : x.knife;
        const inc = Math.min(incHp, incFood);

        return {
          ...x,
          hp: x.hp + inc,
          food: x.food - inc,
        };
      });
    },
    config.throttle,
    []
  );

  const dungeon = useThrottle(() => {}, config.throttle, []);

  const attack = useThrottle(
    () => {
      onAttack(self.sword);
    },
    config.throttle,
    [self.sword]
  );

  const updateAxe = () => {
    setSelf((x) =>
      x.wood < 2 || x.ore < 1
        ? x
        : {
            ...x,
            wood: x.wood - 2,
            ore: x.ore - 1,
            axeXp: x.axeXp + 1,
            axe: x.axeXp + 1 >= x.axe * 10 ? x.axe + 1 : x.axe,
          }
    );
  };

  const updatePick = () => {
    setSelf((x) =>
      x.wood < 1 || x.ore < 2
        ? x
        : {
            ...x,
            wood: x.wood - 1,
            ore: x.ore - 2,
            pickXp: x.pickXp + 1,
            pick: x.pickXp + 1 >= x.pick * 10 ? x.pick + 1 : x.pick,
          }
    );
  };

  const updateHoe = () => {
    setSelf((x) =>
      x.wood < 2 || x.ore < 1
        ? x
        : {
            ...x,
            wood: x.wood - 2,
            ore: x.ore - 1,
            hoeXp: x.hoeXp + 1,
            hoe: x.hoeXp + 1 >= x.hoe * 10 ? x.hoe + 1 : x.hoe,
          }
    );
  };

  const updateKnife = () => {
    setSelf((x) =>
      x.wood < 1 || x.ore < 1 || x.food < 1
        ? x
        : {
            ...x,
            wood: x.wood - 1,
            ore: x.ore - 1,
            food: x.food - 1,
            knifeXp: x.knifeXp + 1,
            knife: x.knifeXp + 1 >= x.knife * 10 ? x.knife + 1 : x.knife,
          }
    );
  };

  const updateSword = () => {
    setSelf((x) =>
      x.ore < 3
        ? x
        : {
            ...x,
            ore: x.ore - 3,
            swordXp: x.swordXp + 1,
            sword: x.swordXp + 1 >= x.sword * 10 ? x.sword + 1 : x.sword,
          }
    );
  };

  const updateShield = () => {
    setSelf((x) =>
      x.wood < 3
        ? x
        : {
            ...x,
            wood: x.wood - 3,
            shieldXp: x.shieldXp + 1,
            shield: x.shieldXp + 1 >= x.shield * 10 ? x.shield + 1 : x.shield,
          }
    );
  };

  return (
    <div className="Game">
      {countdown > 0 && (
        <div className="countdown modal">
          <div className="content">
            <h2>Get Ready!</h2>
            <h1>{countdown}</h1>
          </div>
        </div>
      )}

      {(self.hp === 0 || enemy.hp === 0) && (
        <div className="end-game modal">
          <div className="content">
            <h1>{self.hp === 0 ? 'You loose' : 'You win!'}</h1>
            <button onClick={onBack}>Back to rooms</button>
          </div>
        </div>
      )}

      <div className="column">
        <div className="scoreboard row">
          <div className="player column">
            <div className="name">{self.name}</div>
            <div className="hp">HP: {Math.round(self.hp)}</div>
          </div>
          <div className="player column">
            <div className="name">{enemy.name}</div>
            <div className="hp">HP: {Math.round(enemy.hp)}</div>
          </div>
        </div>

        <div className="stats row">
          <div>Wood: {self.wood}</div>
          <div>Ore: {self.ore}</div>
          <div>Food: {self.food}</div>
        </div>

        <div className="row">
          <div className="sidebar column">
            <Tool
              update={updateAxe}
              label="Axe"
              level={self.axe}
              xp={self.axeXp}
            />
            <Tool
              update={updatePick}
              label="Pick"
              level={self.pick}
              xp={self.pickXp}
            />
            <Tool
              update={updateHoe}
              label="Hoe"
              level={self.hoe}
              xp={self.hoeXp}
            />
            <Tool
              update={updateKnife}
              label="Knife"
              level={self.knife}
              xp={self.knifeXp}
            />
            <Tool
              update={updateSword}
              label="Sword"
              level={self.sword}
              xp={self.swordXp}
            />
            <Tool
              update={updateShield}
              label="Shield"
              level={self.shield}
              xp={self.shieldXp}
            />
          </div>

          <div className="main">
            <div className="row">
              <button onClick={forest}>Forest</button>
              <button onClick={mountain}>Mountain</button>
              <button onClick={farm}>Farm</button>
            </div>

            <div className="row">
              <button onClick={campfire}>Campfire</button>
              <button onClick={dungeon}>Dungeon</button>
              <button onClick={attack}>Attack</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
