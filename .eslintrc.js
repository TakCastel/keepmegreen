module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@next/next/no-img-element': 'off',
    '@next/next/no-page-custom-font': 'off',
    'react/no-unescaped-entities': 'off'
  },
  ignorePatterns: ['node_modules/', '.next/', 'out/']
};
