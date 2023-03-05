export const mapObject = (obj, transform) => {
    return Object.keys(obj).map((key) => {
      return transform(obj[key], key);
    });
  };
  