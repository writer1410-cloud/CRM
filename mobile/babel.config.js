module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo は expo-router / typed routes に必要な設定を含む
    presets: ['babel-preset-expo'],
  };
};
