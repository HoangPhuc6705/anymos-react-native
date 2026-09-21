import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Palette } from '@/constants/themes';

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
  /** Tailwind className */
  className?: string;
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

const variantContainerClasses: Record<ButtonVariant, string> = {
  default: 'bg-violet-500 active:bg-violet-600',
  secondary: 'bg-grey-200 active:bg-grey-300',
  outline: 'bg-transparent border border-grey-300 active:bg-grey-100',
  ghost: 'bg-transparent active:bg-grey-100',
  destructive: 'bg-error-dark active:bg-error',
};

const variantTextClasses: Record<ButtonVariant, string> = {
  default: 'text-white',
  secondary: 'text-grey-800',
  outline: 'text-grey-950',
  ghost: 'text-grey-950',
  destructive: 'text-white',
};

const spinnerColors: Record<ButtonVariant, string> = {
  default: Palette.white,
  secondary: Palette.grey[800],
  outline: Palette.grey[950],
  ghost: Palette.grey[950],
  destructive: Palette.white,
};

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
  className = '',
  style,
  textStyle,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const content = title ?? children;

  // Size classes
  const sizeContainerClass =
    size === 'sm'
      ? iconOnly
        ? 'w-8 h-8'
        : 'h-8 px-3'
      : size === 'lg'
      ? iconOnly
        ? 'w-14 h-14'
        : 'h-14 px-5'
      : iconOnly
      ? 'w-11 h-11'
      : 'h-11 px-5';

  const textSizeClass =
    size === 'sm' ? 'text-sm leading-5' : 'text-base leading-6';

  const iconSlotClass =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  // Variant classes
  const variantClass = isDisabled
    ? 'bg-grey-100 opacity-60'
    : variantContainerClasses[variant];

  const textVariantClass = isDisabled
    ? 'text-grey-400'
    : variantTextClasses[variant];

  const spinnerColor = isDisabled
    ? Palette.grey[400]
    : spinnerColors[variant];

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
      className={`flex-row items-center justify-center rounded-pill overflow-hidden ${
        fullWidth ? 'w-full' : ''
      } ${sizeContainerClass} ${variantClass} ${className}`}
      style={style}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <View className="flex-row items-center justify-center gap-1">
          {leadingIcon && (
            <View className={`items-center justify-center ${iconSlotClass}`}>
              {leadingIcon}
            </View>
          )}

          {!iconOnly && content != null && (
            <View className="px-1 items-center justify-center">
              {typeof content === 'string' || typeof content === 'number' ? (
                <Text
                  numberOfLines={1}
                  className={`font-sans-semibold text-center ${textSizeClass} ${textVariantClass}`}
                  style={textStyle}
                >
                  {content}
                </Text>
              ) : (
                content
              )}
            </View>
          )}

          {trailingIcon && !iconOnly && (
            <View className={`items-center justify-center ${iconSlotClass}`}>
              {trailingIcon}
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

export default Button;