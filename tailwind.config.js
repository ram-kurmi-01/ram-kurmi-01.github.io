/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },

      /**
       * One forest, four materials:
       *   soil    — every dark surface, from page ground to raised card
       *   moss    — mid greens for borders, dividers, secondary strokes
       *   leaf    — the accent. Vivid greens for anything active or alive
       *   bark    — warm browns, structural: trunks, rules, timeline spine
       *   firefly — the single non-green. Spent sparingly so gold always
       *             means "here": focus rings, active nav, live counters
       *   mist    — text scale, warm-tinted so it sits on green without
       *             the blue cast pure grey picks up
       *   haze    — the tint behind glass surfaces (replaces white/x, which
       *             reads cold against soil)
       */
      colors: {
        soil: {
          950: '#040c05',
          900: '#07130a',
          800: '#0b1c0e',
          700: '#102614',
          600: '#16331a',
          500: '#1d4222',
        },
        moss: {
          600: '#2a5124',
          500: '#3f6b2f',
          400: '#548a3c',
          DEFAULT: '#3f6b2f',
        },
        leaf: {
          600: '#4aa544',
          500: '#63c24d',
          400: '#86e05a',
          300: '#a7ea7d',
          200: '#c3f58c',
          light: '#c3f58c',
          dark: '#4aa544',
          DEFAULT: '#86e05a',
        },
        bark: {
          700: '#2d1a0a',
          500: '#4a2c12',
          300: '#7a4d21',
          DEFAULT: '#4a2c12',
        },
        firefly: {
          400: '#ffd27a',
          300: '#ffe0a3',
          DEFAULT: '#ffd27a',
        },
        mist: {
          50: '#f4fcee',
          100: '#dfeed6',
          200: '#c2d9b5',
          300: '#9db892',
          400: '#78916f',
        },
        haze: '#dfeed6',

        // Legacy `forest-*` scale, re-pointed at the new greens so the
        // gradient tints in Skills/Services keep working.
        forest: {
          950: '#040c05',
          900: '#07130a',
          800: '#0b1c0e',
          700: '#102614',
          600: '#16331a',
          500: '#1d4222',
          400: '#2a5124',
          300: '#3f6b2f',
          200: '#548a3c',
          100: '#63c24d',
          50: '#86e05a',
        },
      },

      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite alternate',
        sway: 'sway 5s ease-in-out infinite',
        'leaf-fall': 'leafFall 10s linear infinite',
        'pulse-leaf': 'pulseLeaf 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'grow-up': 'growUp 1s ease-out forwards',
        'firefly-drift': 'fireflyDrift 7s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'blur(0px)' },
          '100%': { opacity: '1', filter: 'blur(2px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        leafFall: {
          '0%': { transform: 'translateY(-40px) rotate(0deg)', opacity: '0' },
          '5%': { opacity: '1' },
          '95%': { opacity: '0.7' },
          '100%': { transform: 'translateY(105vh) rotate(720deg)', opacity: '0' },
        },
        pulseLeaf: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(134,224,90,0)' },
          '50%': { boxShadow: '0 0 30px 8px rgba(134,224,90,0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        growUp: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
        fireflyDrift: {
          '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.35' },
          '30%': { transform: 'translate(14px, -18px)', opacity: '1' },
          '65%': { transform: 'translate(-10px, -8px)', opacity: '0.6' },
        },
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'forest-mesh': `
          radial-gradient(at 20% 30%, rgba(134,224,90,0.12) 0px, transparent 50%),
          radial-gradient(at 80% 10%, rgba(99,194,77,0.08) 0px, transparent 50%),
          radial-gradient(at 50% 80%, rgba(63,107,47,0.10) 0px, transparent 50%)
        `,
        'shimmer-leaf':
          'linear-gradient(90deg, transparent 0%, rgba(134,224,90,0.15) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
};
