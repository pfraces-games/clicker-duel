import { useMemo } from 'react';
import { throttle } from '../../lib';

export default function useThrottle(func, wait, deps) {
  return useMemo(() => throttle(func, wait), deps);
}
