import { useState, useEffect } from 'react';

export default function useCountdown(initialCountdown) {
  const [countdown, setCountdown] = useState(initialCountdown);
  const timeout = Date.now() + countdown * 1000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeleft = timeout - Date.now();
      setCountdown(Math.round(timeleft / 1000));

      if (timeleft < 0) {
        setCountdown(0);
        clearInterval(intervalId);
      }
    }, 200);

    return () => {
      clearInterval(intervalId);
    };
  }, [timeout]);

  return countdown;
}
