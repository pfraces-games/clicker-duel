export const mapObject = (obj, transform) => {
  return Object.keys(obj).map((key) => {
    return transform(obj[key], key);
  });
};

export const throttle = (func, wait = 0) => {
  let pause = false;
  let timeoutId;

  const throttled = (...args) => {
    if (pause) {
      return;
    }

    func.apply(this, args);
    pause = true;

    timeoutId = setTimeout(() => {
      pause = false;
    }, wait);
  };

  throttled.cancel = () => {
    clearTimeout(timeoutId);
  };

  return throttled;
};
