module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['tools/ui-previews/*.cjs'],
      parserOptions: {ecmaVersion: 2022, sourceType: 'script'},
    },
  ],
};
