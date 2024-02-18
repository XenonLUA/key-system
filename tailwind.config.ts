import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        main: {
          '50': '#ecf2ff',
          '100': '#dde7ff',
          '200': '#c2d3ff',
          '300': '#9db4ff',
          '400': '#758cff',
          '500': '#5564ff',
          '600': '#3637f5',
          '700': '#2c2ad8',
          '800': '#2526ae',
          '900': '#262989',
          '950': '#070719',
        },
      },
    },
  },
  plugins: [],
}

export default config