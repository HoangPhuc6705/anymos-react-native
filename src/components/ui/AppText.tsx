import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Typography, Palette } from '@/constants/themes';

export interface AppTextProps extends TextProps {
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

export function AppText({ weight = 'regular', style, ...props }: AppTextProps) {
  return (
    <Text
      style={[
        styles.base,
        styles[weight],
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: Typography.fontFamily.sans,
    color: Palette.grey[950],
    fontSize: Typography.fontSize.base,
  },
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
});