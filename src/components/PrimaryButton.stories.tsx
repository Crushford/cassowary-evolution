import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PrimaryButton } from './PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Pachinko/PrimaryButton',
  component: PrimaryButton,
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
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Primary Button',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span>🎯</span>
        Next Step
      </>
    ),
  },
};

export const MultipleButtons: Story = {
  render: () => (
    <div className="flex gap-4">
      <PrimaryButton>Next Step</PrimaryButton>
      <PrimaryButton>Drop Egg</PrimaryButton>
      <PrimaryButton disabled>Reset</PrimaryButton>
    </div>
  ),
};
