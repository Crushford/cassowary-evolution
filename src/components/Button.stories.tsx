import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    chromatic: {
      tags: ['visual', 'component'],
    },
  },
  tags: ['autodocs', 'visual'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    children: 'Button',
    variant: 'danger',
  },
};

export const Large: Story = {
  args: {
    children: 'Button',
    size: 'lg',
  },
};

export const Small: Story = {
  args: {
    children: 'Button',
    size: 'sm',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Button',
    disabled: true,
  },
};

// Interactive states for Chromatic testing
export const HoverState: Story = {
  args: {
    children: 'Hover me',
    variant: 'primary',
  },
  parameters: {
    chromatic: {
      modes: {
        hover: {
          hover: true,
        },
      },
    },
  },
};

export const FocusState: Story = {
  args: {
    children: 'Focus me',
    variant: 'secondary',
  },
  parameters: {
    chromatic: {
      modes: {
        focus: {
          focus: true,
        },
      },
    },
  },
};

// Different content lengths to test layout
export const LongText: Story = {
  args: {
    children: 'This is a very long button text that might wrap',
    variant: 'primary',
    size: 'sm',
  },
};

export const ShortText: Story = {
  args: {
    children: 'Hi',
    variant: 'danger',
    size: 'lg',
  },
};
