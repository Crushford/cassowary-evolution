import React from 'react';

type EggProps = {
  x: number;
  y: number;
  glow?: boolean;
  className?: string;
};

export function Egg({ x, y, glow = false, className = '' }: EggProps) {
  return (
    <div
      data-testid="egg"
      className={[
        'absolute w-5 h-5 rounded-full bg-text transition-transform duration-150 ease-out will-change-transform',
        glow
          ? 'text-accent drop-shadow-[0_0_6px_currentColor] outline outline-2 outline-accent outline-offset-2'
          : '',
        className,
      ].join(' ')}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    />
  );
}
