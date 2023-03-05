import { useRef } from "react";

export default function Tool({ update, label, level, xp }) {
  const timer = useRef(null);

  const increment = () => {
    timer.current = setInterval(update, 100);
  };

  function timeoutClear() {
    clearInterval(timer.current);
  }

  return (
    <button
      onMouseLeave={timeoutClear}
      onMouseUp={timeoutClear}
      onMouseDown={increment}
    >
      {label} (Lvl. {level} Xp: {xp})
    </button>
  );
}
