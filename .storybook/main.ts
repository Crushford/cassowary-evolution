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
    return config;
  },
};

export default config;