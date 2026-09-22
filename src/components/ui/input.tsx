import React, { forwardRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Palette } from '@/constants/themes';

export type InputSize = 'sm' | 'default' | 'lg';

export interface InputProps extends Omit<TextInputProps, 'size'> {
  /** Size variant matching Figma specs: 'sm' (32px), 'default' (44px), 'lg' (56px) */
  size?: InputSize;
  /** Slot for icon at the start of the input (Figma: Show Input leading icon slot) */
  leadingIcon?: React.ReactNode;
  /** Slot for icon at the end of the input (Figma: Show Input trailing icon slot) */
  trailingIcon?: React.ReactNode;
  /** Text for an embedded trailing action button (e.g. "Gửi mã", "Send", "Apply") */
  buttonName?: string;
  /** Callback when the trailing action button is pressed */
  onButtonPress?: () => void;
  /** Disabled state for the trailing action button */
  buttonDisabled?: boolean;
  /** Error state for input border (Figma: State=Error) */
  error?: boolean | string;
  /** Disabled state */
  disabled?: boolean;
  /** Full width container */
  fullWidth?: boolean;
  /** Tailwind className for outer container */
  className?: string;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Text input style */
  style?: StyleProp<TextStyle>;
  /** Test ID */
  testID?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      size = 'default',
      leadingIcon,
      trailingIcon,
      buttonName,
      onButtonPress,
      buttonDisabled = false,
      error = false,
      disabled = false,
      fullWidth = true,
      className = '',
      containerStyle,
      style,
      placeholderTextColor = Palette.grey[500],
      onFocus,
      onBlur,
      testID,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus: TextInputProps['onFocus'] = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur: TextInputProps['onBlur'] = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const isError = Boolean(error);

    // Size classes
    const sizeContainerClass =
      size === 'sm' ? 'h-8 px-3' : size === 'lg' ? 'h-14 px-4' : 'h-11 px-4';

    const inputSizeClass =
      size === 'sm' ? 'text-sm leading-5' : 'text-base leading-6';

    const iconSizeClass =
      size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

    const buttonSizeClass =
      size === 'sm'
        ? 'px-2 h-6'
        : size === 'lg'
        ? 'px-4 h-9'
        : 'px-3 h-7';

    const buttonTextSizeClass =
      size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs';

    // State classes (keep border-2 constant across all states to prevent layout shift)
    const stateClass = disabled
      ? 'bg-grey-100 border-2 border-grey-200'
      : isError
      ? 'bg-white border-2 border-error'
      : isFocused
      ? 'bg-white border-2 border-violet-500'
      : 'bg-white border-2 border-grey-200';

    return (
      <View
        testID={testID}
        className={`flex-row items-center rounded-pill gap-3 ${
          fullWidth ? 'w-full' : ''
        } ${sizeContainerClass} ${stateClass} ${className}`}
        style={containerStyle}
      >
        {/* Leading Icon Slot */}
        {leadingIcon && (
          <View className={`items-center justify-center ${iconSizeClass}`}>
            {leadingIcon}
          </View>
        )}

        {/* Text Input */}
        <TextInput
          ref={ref}
          editable={!disabled}
          placeholderTextColor={placeholderTextColor}
          underlineColorAndroid="transparent"
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`flex-1 font-sans py-0 ${inputSizeClass} ${
            disabled ? 'text-grey-400' : 'text-grey-950'
          }`}
          style={[
            ...Platform.select({
              web: [
                {
                  outlineStyle: 'none' as any,
                  outlineWidth: 0,
                },
              ],
              default: [],
            }),
            style,
          ]}
          {...rest}
        />

        {/* Embedded Button Name Slot */}
        {buttonName && (
          <Pressable
            accessibilityRole="button"
            disabled={disabled || buttonDisabled}
            onPress={onButtonPress}
            className={`rounded-pill items-center justify-center ${buttonSizeClass} ${
              disabled || buttonDisabled
                ? 'bg-grey-200'
                : 'bg-violet-500 active:bg-violet-600'
            }`}
          >
            <Text
              className={`font-sans-semibold ${buttonTextSizeClass} ${
                disabled || buttonDisabled ? 'text-grey-400' : 'text-white'
              }`}
            >
              {buttonName}
            </Text>
          </Pressable>
        )}

        {/* Trailing Icon Slot */}
        {trailingIcon && (
          <View className={`items-center justify-center ${iconSizeClass}`}>
            {trailingIcon}
          </View>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;
