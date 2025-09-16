import type { StorybookConfig } from '@storybook/react-webpack5';

const disableDocgen = process.env.SB_DOCGEN_DISABLED === '1';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-viewport',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: disableDocgen
    ? { react: { docgen: false } }
    : {
        autodocs: true,
        react: {
          docgen: 'react-docgen-typescript',
          docgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            shouldRemoveUndefinedFromOptional: true,
            savePropValueAsString: true,
          },
        },
      },
  webpackFinal: async (config) => {
    // Ensure TypeScript files are handled properly
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    });

    // Remove Storybook's react-docgen (JS) loader if added by presets
    if (Array.isArray(config.module?.rules)) {
      const originalRules = config.module.rules as any[];
      config.module.rules = originalRules.map((rule: any) => {
        if (!rule || !rule.use) return rule;
        const useArray = Array.isArray(rule.use) ? rule.use : [rule.use];
        const filtered = useArray.filter((u: any) => {
          const loaderPath = typeof u === 'string' ? u : u && u.loader;
          return !(loaderPath && String(loaderPath).includes('react-docgen-loader'));
        });
        if (filtered.length !== useArray.length) {
          return { ...rule, use: filtered };
        }
        return rule;
      });
      if (process.env.CI) {
        const hasDocgenLoader = JSON.stringify(config.module.rules).includes('react-docgen-loader');
        // eslint-disable-next-line no-console
        console.log('[storybook] react-docgen-loader present after strip?', hasDocgenLoader);
      }
    }
    return config;
  },
};

export default config;