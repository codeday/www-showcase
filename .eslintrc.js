module.exports = {
  extends: '@codeday',
  ignorePatterns: ['__tests__/**/*.test.js'],
  rules: {
    'import/no-missing-require': ['off'],
    'import/no-unresolved': ['off'],
    'require-jsdoc': ['off'],
    'import/prefer-default-export': ['off'],
  },

  parserOptions: {
    ecmaVersion: 2020,
  },
};
