import {StyleSheet} from 'react-native';

/**
 * Classic BAILA: semantic tokens keep component styles independent of a hue.
 * Cyan is decorative; the darker accent is used for readable controls and icons.
 */
export const colors = {
  background: '#F0F8EC',
  surface: '#FFFFFF',
  text: '#173823',
  textMuted: '#50634E',
  primary: '#237D39',
  onPrimary: '#FFFFFF',
  secondary: '#DDEFD5',
  onSecondary: '#173823',
  accent: '#0AA7D5',
  accentText: '#007A9E',
  accentSoft: '#E2F4FB',
  highlight: '#E9BD59',
  border: '#C9DDC3',
};

export const spacing = {xs: 4, sm: 8, md: 16, lg: 24, xl: 32};
export const radii = {button: 18, card: 20, control: 14, panel: 24};

export const typography = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1.3,
  },
  body: {color: colors.textMuted, fontSize: 15, lineHeight: 23},
});
