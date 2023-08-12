const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  env: {
    es2022: true,
    node: true,
    mocha: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  plugins: ['promise', 'spellcheck'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:promise/recommended'
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.eslint.json'
      }
    }
  },
  rules: {
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true
      }
    ],
    'import/order': 'error',

    'spellcheck/spell-checker': [
      'warn',
      {
        skipWords: [
          'axios',
          'benoit',
          'benny',
          'browserslist',
          'builtins',
          'christopher',
          'cjs',
          'cloneable',
          'comparator',
          'cpu',
          'cpus',
          'ctx',
          'deprecations',
          'dequeue',
          'dequeued',
          'ecma',
          'elu',
          'enqueue',
          'enum',
          'errored',
          'esm',
          'fastify',
          'fibonacci',
          'fp',
          'fs',
          'inheritDoc',
          'jsdoc',
          'localhost',
          'microjob',
          'mjs',
          'npx',
          'num',
          'os',
          'perf',
          'piscina',
          'pnpm',
          'poolifier',
          'poolify',
          'readonly',
          'req',
          'resize',
          'sinon',
          'threadjs',
          'threadwork',
          'tinypool',
          'tsconfig',
          'tsdoc',
          'typedoc',
          'unlink',
          'unref',
          'unregister',
          'utf8',
          'workerpool',
          'ws',
          'wss',
          'wwr'
        ],
        skipIfMatch: ['^@.*', '^plugin:.*']
      }
    ]
  },
  overrides: [
    {
      files: ['**/*.ts'],
      plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.eslint.json'
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
        'standard-with-typescript'
      ],
      rules: {
        '@typescript-eslint/no-inferrable-types': [
          'error',
          { ignoreProperties: true }
        ],
        'tsdoc/syntax': 'warn'
      }
    },
    {
      files: ['examples/typescript/**/*.ts'],
      rules: {
        'import/no-unresolved': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/return-await': 'off'
      }
    },
    {
      files: ['**/*.js', '**/*.mjs'],
      plugins: ['jsdoc'],
      extends: ['plugin:n/recommended', 'plugin:jsdoc/recommended', 'standard']
    },
    {
      files: ['tests/**/*.js'],
      rules: {
        'jsdoc/require-jsdoc': 'off'
      }
    },
    {
      files: ['tests/pools/selection-strategies/**/*.js'],
      rules: {
        'n/no-missing-require': 'off'
      }
    },
    {
      files: ['benchmarks/**/*.js', 'benchmarks/**/*.mjs'],
      rules: {
        'jsdoc/require-jsdoc': 'off'
      }
    },
    {
      files: ['benchmarks/versus-external-pools/**/*.js'],
      rules: {
        'n/no-missing-require': 'off'
      }
    },
    {
      files: ['benchmarks/versus-external-pools/**/*.mjs'],
      rules: {
        'n/no-missing-import': 'off',
        'import/no-unresolved': 'off'
      }
    },
    {
      files: ['examples/javascript/**/*.js'],
      rules: {
        'n/no-missing-require': 'off',
        'jsdoc/require-jsdoc': 'off'
      }
    }
  ]
})
