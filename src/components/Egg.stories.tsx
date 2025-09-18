import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Egg } from './Egg';

const meta: Meta<typeof Egg> = {
  title: 'Pachinko/Egg',
  component: Egg,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0B0E12' }],
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="bg-bg text-text min-h-dvh antialiased" data-theme="dark">
        <div className="mx-auto max-w-4xl p-4 md:p-6">
          <div className="bg-panel border-line rounded-2xl border p-4 md:p-6">
            <div className="bg-panel2 border-line relative size-32 rounded-2xl border">
              <Story />
            </div>
          </div>
        </div>
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    x: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    y: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    glow: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    x: 50,
    y: 50,
    glow: false,
  },
};

export const WithGlow: Story = {
  args: {
    x: 50,
    y: 50,
    glow: true,
  },
};

export const Moving: Story = {
  args: {
    x: 20,
    y: 20,
    glow: true,
  },
};
