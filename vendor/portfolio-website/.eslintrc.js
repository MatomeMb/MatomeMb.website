module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Relaxed rules for deployment
    'indent': 'off',
    'semi': 'off',
    'no-trailing-spaces': 'off',
    'quotes': 'off',
    'space-before-function-paren': 'off',
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'no-undef': 'error'
  },
  globals: {
    'global': 'readonly',
    'process': 'readonly',
    'module': 'readonly',
    'require': 'readonly',
    'exports': 'readonly',
    'Buffer': 'readonly',
    '__dirname': 'readonly',
    '__filename': 'readonly'
  }
};
