module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended',
    'stylelint-config-tailwindcss',
  ],
  rules: {
    'alpha-value-notation': 'number',
    'color-function-notation': 'modern',
    'no-descending-specificity': null,
    'declaration-no-important': true,
  },
  ignoreFiles: ['**/*.ts', '**/*.tsx'],
};
