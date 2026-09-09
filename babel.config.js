module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // O plugin do Reanimated/Worklets já vem configurado automaticamente
    // pelo babel-preset-expo no SDK 57 — não deve ser adicionado à mão.
  };
};
