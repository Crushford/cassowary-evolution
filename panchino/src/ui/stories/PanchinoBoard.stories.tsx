import type { Meta, StoryObj } from '@storybook/react';
import { PanchinoBoard } from '../PanchinoBoard';

const meta: Meta<typeof PanchinoBoard> = {
  title: 'Panchino/PanchinoBoard',
  component: PanchinoBoard,
  args: { 
    rows: 6, 
    slots: 7, 
    startColumn: 3, 
    autoAdvance: false 
  },
  parameters: {
    layout: 'centered',
    chromatic: { pauseAnimationAtEnd: true }
  }
};
export default meta;

type Story = StoryObj<typeof PanchinoBoard>;

export const BaseIdle: Story = {
  args: { seed: 123 }
};

export const MidThreeSteps: Story = {
  args: {
    seed: 999,
    stepsScript: [-1, +1, -1] // L, R, L - custom prop for deterministic testing
  }
};

export const EndCenterLanded: Story = {
  args: {
    stepsScript: [+1, -1, +1, -1, +1, -1], // Final column 3
    fixedChickReward: 2 // For stable testing
  }
};

export const EndLeftEdgeLanded: Story = {
  args: { 
    stepsScript: [-1, -1, -1, -1, -1, -1] // All left steps -> slot 0
  }
};

export const EndRightEdgeLanded: Story = {
  args: { 
    stepsScript: [+1, +1, +1, +1, +1, +1] // All right steps -> slot 6
  }
};

export const RoundThreeDropsSummary: Story = {
  args: {
    seed: 777,
    // This would need additional logic to auto-run 3 drops
    // For now, this shows the component ready for multiple drops
  }
};

export const ErrorOutOfBoundsGuard: Story = {
  args: {
    rows: 6,
    slots: 7,
    startColumn: 10, // Invalid - should be clamped
    seed: 42
  }
};
