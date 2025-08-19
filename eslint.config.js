import { Linter } from 'eslint';

const config = {
  extends: 'next/core-web-vitals',
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/no-unescaped-entities': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'prefer-const': 'off',
    'import/no-unused-modules': 'off'
  },
  ignores: [
    'src/app/api/logs/search/route.ts',
    'src/app/discord/help/page.tsx',
    'src/app/logs/page.tsx',
    'src/app/migration/page.tsx',
    'src/app/page.tsx',
    'src/app/skin-creator/page.tsx',
    'src/utils/database.ts',
    'src/utils/logParser.ts'
  ]
};

export default config;