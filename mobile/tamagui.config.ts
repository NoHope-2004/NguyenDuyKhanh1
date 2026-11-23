import { createTamagui, createTokens } from '@tamagui/core';

export const tokens = createTokens({
  color: {
    primary: '#C45123',
    primaryLight: '#FBECE6',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    textPrimary: '#202428',
    textSecondary: '#737780',
    divider: '#E5E7EB',
    success: '#287A4B',
    error: '#B42318',
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
  },
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
  },
  radius: {
    0: 0,
    1: 4,
    2: 6,
    3: 8,
    4: 12,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
  },
});

export const config = createTamagui({
  tokens,
  themes: {
    light: {
      bg: tokens.color.background,
      color: tokens.color.textPrimary,
      primary: tokens.color.primary,
      surface: tokens.color.surface,
      borderColor: tokens.color.divider,
    },
    dark: {
      bg: '#1A1A1A',
      color: '#FFFFFF',
      primary: tokens.color.primary,
      surface: '#242424',
      borderColor: '#333333',
    },
  },
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    gtXs: { minWidth: 661 },
    gtSm: { minWidth: 801 },
  },
});

export type AppConfig = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
