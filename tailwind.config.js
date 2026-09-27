/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontSize: {
        base: ['17px', { lineHeight: '24px' }],
      },
      fontFamily: {
        sans: ["OpenSans_400Regular", "Open Sans", "sans-serif"],
        "open-sans": ["OpenSans_400Regular", "Open Sans", "sans-serif"],
        "open-sans-medium": ["OpenSans_500Medium", "Open Sans", "sans-serif"],
        "open-sans-semibold": ["OpenSans_600SemiBold", "Open Sans", "sans-serif"],
        "open-sans-bold": ["OpenSans_700Bold", "Open Sans", "sans-serif"],
      },
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          variant: 'rgb(var(--surface-variant) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        mute: {
          DEFAULT: 'rgb(var(--mute) / <alpha-value>)',
          foreground: 'rgb(var(--mute-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        disabled: {
          DEFAULT: 'rgb(var(--disabled) / <alpha-value>)',
          foreground: 'rgb(var(--disabled-foreground) / <alpha-value>)',
        },
        
        // Colors dùng chung
        border: 'rgb(var(--border) / <alpha-value>)',
        outline: 'rgb(var(--outline) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        divider: 'rgb(var(--divider) / <alpha-value>)',
        
        // Feedback colors
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        overlay: 'rgb(var(--overlay) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}

