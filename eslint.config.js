import antfu from '@antfu/eslint-config'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu({
  ignores: [
    '**/node_modules/',
    '**/build/',
    '**/dist/',
    '**/.next/',
    '**/*.md',
    '_developer/types/'
  ],
  rules: {
    'node/prefer-global/process': 'off',
    'node/prefer-global/buffer': 'off',
    'react/no-array-index-key': 'off',
    'jsdoc/empty-tags': 'off',
    'ts/no-require-imports': 'off',
    'ts/no-unused-vars': 'off',
    'ts/explicit-function-return-type': 'off',
    'ts/ban-ts-comment': 'off',
    'ts/no-use-before-define': 'off',
    'ts/consistent-type-definitions': 'off',
    'ts/no-non-null-asserted-optional-chain': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/prefer-string-starts-ends-with': 'off',
    'regexp/no-unused-capturing-group': 'off',
    'regexp/no-misleading-capturing-group': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'regexp/optimal-quantifier-concatenation': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react-refresh/only-export-components': 'off',
    'react/no-clone-element': 'off',
    'react/no-children-for-each': 'off',
    'react/no-children-count': 'off',
    'react/no-children-map': 'off',
    'react/no-children-only': 'off',
    'react/no-unstable-default-props': 'off',
    'react/no-create-ref': 'off',
    'perfectionist/sort-imports': 'off',
    'perfectionist/sort-named-imports': 'off',
    'perfectionist/sort-named-exports': 'off',
    'regexp/strict': 'off',
    'react/no-forward-ref': 'off',
    'react/no-context-provider': 'off',
    'react/no-use-context': 'off',
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    'react/no-unnecessary-use-prefix': 'off',
    'react-hooks/use-memo': 'off',
    'react-hooks/globals': 'off',
    'react-hooks/preserve-manual-memoization': 'off',
    'react-hooks/set-state-in-effect': 'off',
    'react-hooks/refs': 'off',
    'style/multiline-ternary': 'off',
    'style/max-statements-per-line': 'off',
    'style/comma-dangle': 'off',
    'react/react-in-jsx-scope': 'off',
    'style/quote-props': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/check-param-names': 'off',
    'curly': ['error', 'multi-line'],
    'react-dom/no-dangerously-set-innerhtml': 'off',
    'unused-imports/no-unused-vars': 'off',
    'react/no-unstable-context-value': 'off',
    'no-console': 'warn',
    'vars-on-top': 'off',
    'consistent-type-definitions': 'off'
  },
  react: true,
  typescript: true,
  nextjs: true,

  // Configuration preferences
  lessOpinionated: true,
  isInEditor: false,

  // Code style
  stylistic: {
    semi: false,
  },

  // Format settings
  formatters: {
    css: true,
  },
},
// --- Tailwind CSS Rules ---
...tailwind.configs['flat/recommended'], {
  settings: {
    tailwindcss: {
      callees: ['clsx', 'cn'],
      config: 'tailwind.config.ts',
      cssFiles: [
        '**/*.css',
        '!**/node_modules',
        '!**/.*',
        '!**/dist',
        '!**/build',
      ],
      cssFilesRefreshRate: 5_000,
      removeDuplicates: true,
      skipClassAttribute: false,
      whitelist: [],
      classRegex: '^class(Name)?$',
    },
  },
},
// --- Custom Rule Overrides ---
{
  rules: {
    'antfu/no-top-level-await': 'off',
    'style/brace-style': ['error', '1tbs'],
    'ts/consistent-type-definitions': ['error', 'type'],
    'react/prefer-destructuring-assignment': 'off',
    'node/prefer-global/process': 'off',
    'no-restricted-globals': 'off',
    'next/no-sync-scripts': 'off',
    'next/no-img-element': 'off',
    'tailwindcss/no-custom-classname': 'off'
  },
})
