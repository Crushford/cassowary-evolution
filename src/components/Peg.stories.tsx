import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Peg } from './Peg';

const meta: Meta<typeof Peg> = {
  title: 'Pachinko/Peg',
  component: Peg,
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
            <div className="grid grid-cols-4 gap-4">
              <Story />
            </div>
          </div>
        </div>
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    pulse: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pulse: false,
  },
};

export const Pulsing: Story = {
  args: {
    pulse: true,
  },
};

export const MultiplePegs: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <Peg />
      <Peg pulse />
      <Peg />
      <Peg />
    </div>
  ),
};
