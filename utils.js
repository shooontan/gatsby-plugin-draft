function get(fn, defaultValue) {
  const types = ['string', 'number', 'boolean'];
  try {
    const value = fn();
    return types.includes(typeof value) ? value : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

module.exports = {
  get,
};
