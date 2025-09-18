import React from 'react';

type PegProps = {
  pulse?: boolean;
  className?: string;
};

export function Peg({ pulse = false, className = '' }: PegProps) {
  return (
    <div
      className={[
        'w-2.5 h-2.5 rounded-full bg-metal shadow-[inset_0_-1px_0_#000]',
        pulse ? 'animate-peg-pulse' : '',
        className,
      ].join(' ')}
    />
  );
}
