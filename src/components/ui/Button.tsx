import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Palette, Radius, Spacing, Typography } from '@/constants/themes';

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';

export type ButtonSize = 'sm' | 'default' | 'lg';

export interface ButtonProps {
  /** Text label or custom child components */
  children?: React.ReactNode;
  /** Button title when not using children */
  title?: string;
  /** Visual style variant defined in Figma */
  variant?: ButtonVariant;
  /** Size variant matching Figma component specifications */
  size?: ButtonSize;
  /** If true, renders a square/circle button sized only for an icon */
  iconOnly?: boolean;
  /** Slot for icon before button label (Figma: Show Leading Icon) */
  leadingIcon?: React.ReactNode;
  /** Slot for icon after button label (Figma: Show Trailing Icon) */
  trailingIcon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state with activity indicator */
  loading?: boolean;
  /** Make button stretch to 100% width of parent */
  fullWidth?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom text style */
  textStyle?: StyleProp<TextStyle>;
  /** Press handler */
  onPress?: (event: GestureResponderEvent) => void;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Test ID for automated tests */
  testID?: string;
}

export function Button({
  children,
  title,
  variant = 'default',
  size = 'default',
  iconOnly = false,
  leadingIcon,
  trailingIcon,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const content = title ?? children;

  // Determine colors based on variant & state
  const getVariantStyles = (pressed: boolean) => {
    if (isDisabled) {
      return {
        container: styles.disabledContainer,
        text: styles.disabledText,
        spinnerColor: Palette.grey[400],
      };
    }

    switch (variant) {
      case 'secondary':
        return {
          container: [
            styles.secondaryContainer,
            pressed && styles.secondaryPressed,
          ],
          text: styles.secondaryText,
          spinnerColor: Palette.grey[800],
        };
      case 'outline':
        return {
          container: [
            styles.outlineContainer,
            pressed && styles.outlinePressed,
          ],
          text: styles.outlineText,
          spinnerColor: Palette.grey[950],
        };
      case 'ghost':
        return {
          container: [
            styles.ghostContainer,
            pressed && styles.ghostPressed,
          ],
          text: styles.ghostText,
          spinnerColor: Palette.grey[950],
        };
      case 'destructive':
        return {
          container: [
            styles.destructiveContainer,
            pressed && styles.destructivePressed,
          ],
          text: styles.destructiveText,
          spinnerColor: Palette.white,
        };
      case 'default':
      default:
        return {
          container: [
            styles.defaultContainer,
            pressed && styles.defaultPressed,
          ],
          text: styles.defaultText,
          spinnerColor: Palette.white,
        };
    }
  };

  // Determine size specifications
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: iconOnly ? styles.sizeSmIconOnly : styles.sizeSm,
          text: styles.sizeSmText,
          iconSlot: styles.iconSlotSm,
        };
      case 'lg':
        return {
          container: iconOnly ? styles.sizeLgIconOnly : styles.sizeLg,
          text: styles.sizeLgText,
          iconSlot: styles.iconSlotLg,
        };
      case 'default':
      default:
        return {
          container: iconOnly ? styles.sizeDefaultIconOnly : styles.sizeDefault,
          text: styles.sizeDefaultText,
          iconSlot: styles.iconSlotDefault,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={
        accessibilityLabel || (typeof content === 'string' ? content : undefined)
      }
      accessibilityHint={accessibilityHint}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => {
        const variantStyles = getVariantStyles(pressed);
        return [
          styles.base,
          sizeStyles.container,
          variantStyles.container,
          fullWidth && styles.fullWidth,
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const variantStyles = getVariantStyles(pressed);

        if (loading) {
          return (
            <ActivityIndicator
              size={size === 'sm' ? 'small' : 'small'}
              color={variantStyles.spinnerColor}
            />
          );
        }

        return (
          <View style={styles.contentRow}>
            {leadingIcon && (
              <View style={[styles.iconSlotBase, sizeStyles.iconSlot]}>
                {leadingIcon}
              </View>
            )}

            {!iconOnly && content != null && (
              <View style={styles.labelWrapper}>
                {typeof content === 'string' || typeof content === 'number' ? (
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.baseText,
                      sizeStyles.text,
                      variantStyles.text,
                      textStyle,
                    ]}
                  >
                    {content}
                  </Text>
                ) : (
                  content
                )}
              </View>
            )}

            {trailingIcon && !iconOnly && (
              <View style={[styles.iconSlotBase, sizeStyles.iconSlot]}>
                {trailingIcon}
              </View>
            )}
          </View>
        );
      }}
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full, // 9999px pill per Figma
    overflow: 'hidden',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4, // 4px gap per Figma layout
  },
  labelWrapper: {
    paddingHorizontal: 4, // 0px 4px per Figma frame EL-5e13477d
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },

  // Base typography
  baseText: {
    fontFamily: Typography.fontFamily.sans,
    fontWeight: Typography.fontWeight.semibold as TextStyle['fontWeight'],
    textAlign: 'center',
  },

  // --- Sizes ---
  // Large: Height 56px, horizontal padding 20px
  sizeLg: {
    height: 56,
    paddingHorizontal: 20,
  },
  sizeLgIconOnly: {
    width: 56,
    height: 56,
    paddingHorizontal: 0,
  },
  sizeLgText: {
    fontSize: Typography.fontSize.base, // 16px
    lineHeight: 24,
  },
  iconSlotLg: {
    width: 24,
    height: 24,
  },

  // Default: Height 44px, horizontal padding 20px
  sizeDefault: {
    height: 44,
    paddingHorizontal: 20,
  },
  sizeDefaultIconOnly: {
    width: 44,
    height: 44,
    paddingHorizontal: 0,
  },
  sizeDefaultText: {
    fontSize: Typography.fontSize.base, // 16px
    lineHeight: 24,
  },
  iconSlotDefault: {
    width: 20,
    height: 20,
  },

  // Small: Height 32px, horizontal padding 12px
  sizeSm: {
    height: 32,
    paddingHorizontal: 12,
  },
  sizeSmIconOnly: {
    width: 32,
    height: 32,
    paddingHorizontal: 0,
  },
  sizeSmText: {
    fontSize: Typography.fontSize.sm, // 14px
    lineHeight: 20,
  },
  iconSlotSm: {
    width: 16,
    height: 16,
  },

  iconSlotBase: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Variants ---
  // Default (Primary Violet)
  defaultContainer: {
    backgroundColor: Palette.violet[500], // #8E51FF
  },
  defaultPressed: {
    backgroundColor: Palette.violet[600], // #7C3AED
  },
  defaultText: {
    color: Palette.white,
  },

  // Secondary (Grey)
  secondaryContainer: {
    backgroundColor: Palette.grey[200], // #E4E4E7
  },
  secondaryPressed: {
    backgroundColor: Palette.grey[300], // #D4D4D8
  },
  secondaryText: {
    color: Palette.grey[800], // #27272A
  },

  // Outline
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Palette.grey[300], // #D4D4D8
  },
  outlinePressed: {
    backgroundColor: Palette.grey[100], // #F4F4F5
  },
  outlineText: {
    color: Palette.grey[950], // #09090B
  },

  // Ghost
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostPressed: {
    backgroundColor: Palette.grey[100], // #F4F4F5
  },
  ghostText: {
    color: Palette.grey[950], // #09090B
  },

  // Destructive (Red)
  destructiveContainer: {
    backgroundColor: Palette.errorDark, // #C10007 (Figma fill_45030133)
  },
  destructivePressed: {
    backgroundColor: Palette.error, // #FB2C36
  },
  destructiveText: {
    color: Palette.white,
  },

  // Disabled
  disabledContainer: {
    backgroundColor: Palette.grey[100], // #F4F4F5 (Figma fill_4ea4bfae)
  },
  disabledText: {
    color: Palette.grey[400], // #9F9FA9
  },
});