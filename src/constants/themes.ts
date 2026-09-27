import { Platform } from 'react-native';

// Violet & Neutral color palette extracted from Figma Anymos & Anymos Component Kit
export const Palette = {
  violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8E51FF',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
    950: '#2E1065',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#9F9FA9',
    500: '#71717B',
    600: '#52525C',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B',
  },
  white: '#FFFFFF',
  black: '#000000',
  error: '#FB2C36',
  errorDark: '#C10007',
  success: '#00C950',
  warning: '#FE9A00',
  info: '#00A6F4',
} as const;

// Theme modes (light / dark)
export const Colors = {
  light: {
    primary: Palette.violet[500],
    primaryForeground: Palette.white,
    primaryHover: Palette.violet[600],
    primaryActive: Palette.violet[700],
    primaryMuted: Palette.violet[100],

    background: Palette.white,
    backgroundSecondary: Palette.grey[50],
    backgroundElement: Palette.grey[100],
    backgroundSelected: Palette.grey[200],
    surface: Palette.white,
    surfaceMuted: Palette.grey[100],

    text: Palette.grey[950],
    textSecondary: Palette.grey[500],
    textMuted: Palette.grey[400],
    textInverse: Palette.white,

    border: Palette.grey[200],
    borderHover: Palette.grey[300],
    borderFocus: Palette.violet[500],
    borderMuted: Palette.grey[100],

    inputBackground: Palette.white,
    inputBorder: Palette.grey[200],
    inputFocus: Palette.violet[500],
    inputError: Palette.error,

    error: Palette.error,
    errorForeground: Palette.white,
    errorMuted: '#FEF2F2',

    success: Palette.success,
    warning: Palette.warning,
    info: Palette.info,

    disabled: Palette.grey[100],
    disabledText: Palette.grey[400],
  },
  dark: {
    primary: Palette.violet[500],
    primaryForeground: Palette.white,
    primaryHover: Palette.violet[400],
    primaryActive: Palette.violet[300],
    primaryMuted: Palette.violet[950],

    background: Palette.grey[950],
    backgroundSecondary: Palette.grey[900],
    backgroundElement: Palette.grey[800],
    backgroundSelected: Palette.grey[700],
    surface: Palette.grey[900],
    surfaceMuted: Palette.grey[800],

    text: Palette.white,
    textSecondary: Palette.grey[400],
    textMuted: Palette.grey[500],
    textInverse: Palette.grey[950],

    border: Palette.grey[800],
    borderHover: Palette.grey[700],
    borderFocus: Palette.violet[400],
    borderMuted: Palette.grey[800],

    inputBackground: Palette.grey[900],
    inputBorder: Palette.grey[800],
    inputFocus: Palette.violet[400],
    inputError: Palette.error,

    error: Palette.error,
    errorForeground: Palette.white,
    errorMuted: '#450A0A',

    success: Palette.success,
    warning: Palette.warning,
    info: Palette.info,

    disabled: Palette.grey[800],
    disabledText: Palette.grey[600],
  },
} as const;

// Dimension tokens: Spacing & padding
export const Spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,

  // Compatibility aliases
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

// Dimension tokens: Corner radius
export const Radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Typography tokens
export const Typography = {
  fontFamily: {
    sans: 'Open Sans',
    default: 'Open Sans',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
  },
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.2,
    wider: 0.4,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export type ThemeMode = 'light' | 'dark';
export type ColorTheme = typeof Colors.light;
export type ColorKey = keyof ColorTheme;
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type SpacingKey = keyof typeof Spacing;
export type BorderRadiusKey = keyof typeof Radius;
export type TypographyKey = keyof typeof Typography;

const theme = {
  Palette,
  Colors,
  Spacing,
  Radius,
  Typography,
  Fonts,
  BottomTabInset,
  MaxContentWidth,
};

export default theme;
