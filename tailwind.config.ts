import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 3 backgrounds (use only these for app backgrounds)
        'app-0': '#071411', // deepest background (page)
        'app-1': '#0B1F1A', // raised surface (cards)
        'app-2': '#133129', // highest surface (popovers/menus)

        // 3 inks (use only these for body text/headings/labels)
        'ink-primary': '#E6F4F1', // main text
        'ink-secondary': '#B6D4CD', // secondary text
        'ink-muted': '#7CA39A', // tertiary/help text

        // Semantics (okay for borders, icons, rings, badges, CTA)
        accent: {
          DEFAULT: '#F6B94B', // nectar/amber
          600: '#DFA640',
          700: '#C89338',
        },
        success: { DEFAULT: '#30B27A' }, // fern
        warning: { DEFAULT: '#C4A46D' }, // dry grass / barren hint
        danger: { DEFAULT: '#C2452D' }, // thylacoleo claw red-brown

        border: { DEFAULT: '#21463C' }, // cool green border
        ring: { DEFAULT: '#F6B94B' }, // reuse accent for focus rings
      },
      // Optional: consistent box shadow hint on dark surfaces
      boxShadow: {
        soft: '0 2px 6px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.03) inset',
      },
    },
  },
  plugins: [],
};

export default config;

