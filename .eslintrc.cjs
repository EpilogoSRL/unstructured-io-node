module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-import',
    'dprint-integration',
    'unused-imports',
  ],
  extends: [
    // Don't use extends, we want to apply rules purposefully
  ],
  ignorePatterns: ['**/*.json'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 2,

    'dprint-integration/dprint': [
      2,
      {
        lineWidth: 120,
      },
      {
        typescript: {
          'quoteStyle': 'preferSingle',
          'binaryExpression.operatorPosition': 'nextLine',
          'conditionalExpression.operatorPosition': 'nextLine',
          'trailingCommas': 'onlyMultiLine',
          'jsx.bracketPosition': 'nextLine',
          'jsx.quoteStyle': 'preferSingle',
          'jsx.multiLineParens': 'always',
          'importDeclaration.sortNamedImports': 'maintain',
          'module.sortImportDeclarations': 'maintain',
          'arrowFunction.useParentheses': 'force',
          'arrowFunction.bracePosition': 'sameLine',
          'singleBodyPosition': 'nextLine',
          'nextControlFlowPosition': 'sameLine',
          'useBraces': 'always',
          'ignoreNodeCommentText': 'eslint-disable-next-line',
          'ignoreFileCommentText': 'eslint-disable',
          'enumDeclaration.memberSpacing': 'newLine',
        },
        json: {},
        markdown: {},
        dockerfile: {},
        toml: {},
        includes: [
          '**/*.{ts,tsx,js,jsx,cjs,mjs,json,md,toml}',
        ],
        excludes: [
          '**/node_modules',
          '**/*-lock.json',
        ],
        plugins: [
          'https://plugins.dprint.dev/typescript-0.84.4.wasm',
          'https://plugins.dprint.dev/json-0.17.2.wasm',
          'https://plugins.dprint.dev/markdown-0.15.2.wasm',
          'https://plugins.dprint.dev/toml-0.5.4.wasm',
          "https://plugins.dprint.dev/dockerfile-0.3.2.wasm"
        ],
      },
    ],

    'unused-imports/no-unused-imports': 2,
    'import/no-default-export': 2,
  },
};
