import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PanchinoBoard } from './PanchinoBoard';

const meta: Meta<typeof PanchinoBoard> = {
  title: 'Pachinko/PanchinoBoard',
  component: PanchinoBoard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0B0E12' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    a11y: {
      // Catch color contrast & semantics early
      element: '#storybook-root',
      config: { rules: [{ id: 'color-contrast', enabled: true }] },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="bg-bg text-text min-h-dvh antialiased" data-theme="dark">
        <div className="mx-auto max-w-4xl p-4 md:p-6">
          <div className="bg-panel border-line rounded-2xl border p-4 md:p-6">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithTitle: Story = {
  args: {},
  decorators: [
    (Story: React.ComponentType) => (
      <div className="bg-bg text-text min-h-dvh antialiased" data-theme="dark">
        <div className="mx-auto max-w-4xl p-4 md:p-6">
          <div className="bg-panel border-line rounded-2xl border p-4 md:p-6">
            <div className="mb-8 text-center">
              <h1 className="text-text mb-4 text-2xl font-bold lg:text-3xl">
                Cassowary Panchino
              </h1>
              <p className="text-dim text-sm md:text-base">
                Dark-mode Pachinko machine with bioluminescent teal accents
              </p>
            </div>
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
};
