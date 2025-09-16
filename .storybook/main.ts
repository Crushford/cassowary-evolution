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
    if (Array.isArray(config.module.rules)) {
      config.module.rules = config.module.rules.filter((rule: any) => {
        const uses = (rule && rule.use) || [];
        const useArray = Array.isArray(uses) ? uses : [uses].filter(Boolean);
        const hasReactDocgenLoader = useArray.some((u: any) => {
          const loaderPath = typeof u === 'string' ? u : u && u.loader;
          return loaderPath && loaderPath.includes('react-docgen-loader');
        });
        return !hasReactDocgenLoader;
      });
    }
    return config;
  },
};

export default config;