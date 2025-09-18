import React from 'react';

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export function PrimaryButton({ className = '', ...rest }: PrimaryButtonProps) {
  return (
    <button
      {...rest}
      className={[
        'inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-panel border border-line text-text',
        'hover:border-accent hover:text-accent',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        'disabled:opacity-50 disabled:hover:border-line disabled:hover:text-text',
        'transition',
        className,
      ].join(' ')}
    />
  );
}
