import React, { forwardRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Palette, Radius, Spacing, Typography } from '@/constants/themes';

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

    // Get size specific styles
    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            container: styles.containerSm,
            input: styles.inputSm,
            iconSlot: styles.iconSlotSm,
            buttonText: styles.buttonTextSm,
            buttonContainer: styles.buttonContainerSm,
          };
        case 'lg':
          return {
            container: styles.containerLg,
            input: styles.inputLg,
            iconSlot: styles.iconSlotLg,
            buttonText: styles.buttonTextLg,
            buttonContainer: styles.buttonContainerLg,
          };
        case 'default':
        default:
          return {
            container: styles.containerDefault,
            input: styles.inputDefault,
            iconSlot: styles.iconSlotDefault,
            buttonText: styles.buttonTextDefault,
            buttonContainer: styles.buttonContainerDefault,
          };
      }
    };

    const sizeStyles = getSizeStyles();

    // Determine state border styles
    const getStateStyles = () => {
      if (disabled) {
        return styles.containerDisabled;
      }
      if (isError) {
        return styles.containerError;
      }
      if (isFocused) {
        return styles.containerFocus;
      }
      return styles.containerDefaultState;
    };

    return (
      <View
        testID={testID}
        style={[
          styles.baseContainer,
          sizeStyles.container,
          getStateStyles(),
          fullWidth && styles.fullWidth,
          containerStyle,
        ]}
      >
        {/* Leading Icon Slot */}
        {leadingIcon && (
          <View style={[styles.iconSlotBase, sizeStyles.iconSlot]}>
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
          style={[
            styles.baseInput,
            sizeStyles.input,
            disabled && styles.inputDisabled,
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
            style={({ pressed }) => [
              styles.baseButton,
              sizeStyles.buttonContainer,
              pressed && styles.buttonPressed,
              (disabled || buttonDisabled) && styles.buttonDisabled,
            ]}
          >
            <Text
              style={[
                styles.baseButtonText,
                sizeStyles.buttonText,
                (disabled || buttonDisabled) && styles.buttonTextDisabled,
              ]}
            >
              {buttonName}
            </Text>
          </Pressable>
        )}

        {/* Trailing Icon Slot */}
        {trailingIcon && (
          <View style={[styles.iconSlotBase, sizeStyles.iconSlot]}>
            {trailingIcon}
          </View>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Radius.full, // 9999px pill per Figma specs
    gap: 12, // 12px gap between icon and text per Figma
  },
  fullWidth: {
    width: '100%',
  },

  // --- Sizes ---
  // Large: Height 56px, horizontal padding 16px
  containerLg: {
    height: 56,
    paddingHorizontal: 16,
  },
  inputLg: {
    fontSize: Typography.fontSize.base, // 16px
    lineHeight: 24,
  },
  iconSlotLg: {
    width: 24,
    height: 24,
  },

  // Default: Height 44px, horizontal padding 16px
  containerDefault: {
    height: 44,
    paddingHorizontal: 16,
  },
  inputDefault: {
    fontSize: Typography.fontSize.base, // 16px
    lineHeight: 24,
  },
  iconSlotDefault: {
    width: 20,
    height: 20,
  },

  // Small: Height 32px, horizontal padding 12px
  containerSm: {
    height: 32,
    paddingHorizontal: 12,
  },
  inputSm: {
    fontSize: Typography.fontSize.sm, // 14px
    lineHeight: 20,
  },
  iconSlotSm: {
    width: 16,
    height: 16,
  },

  // --- State Borders ---
  // Default State (1px border #E4E4E7)
  containerDefaultState: {
    borderWidth: 1,
    borderColor: Palette.grey[200], // #E4E4E7
  },
  // Focus State (2px border #8E51FF per Figma)
  containerFocus: {
    borderWidth: 2,
    borderColor: Palette.violet[500], // #8E51FF
  },
  // Error State (2px border #FB2C36 per Figma)
  containerError: {
    borderWidth: 2,
    borderColor: Palette.error, // #FB2C36
  },
  // Disabled State (#F4F4F5 background, #E4E4E7 border)
  containerDisabled: {
    backgroundColor: Palette.grey[100], // #F4F4F5
    borderWidth: 1,
    borderColor: Palette.grey[200],
  },

  // Input text
  baseInput: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    color: Palette.grey[950],
    paddingVertical: 0, // avoid vertical shift on Android
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
      } as any,
    }),
  },
  inputDisabled: {
    color: Palette.grey[400],
  },

  // Icon Slot
  iconSlotBase: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Embedded Action Button (button-name)
  baseButton: {
    backgroundColor: Palette.violet[500],
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainerLg: {
    paddingHorizontal: 16,
    height: 38,
  },
  buttonContainerDefault: {
    paddingHorizontal: 12,
    height: 30,
  },
  buttonContainerSm: {
    paddingHorizontal: 10,
    height: 24,
  },
  buttonPressed: {
    backgroundColor: Palette.violet[600],
  },
  buttonDisabled: {
    backgroundColor: Palette.grey[200],
  },
  baseButtonText: {
    fontFamily: Typography.fontFamily.sans,
    fontWeight: '600',
    color: Palette.white,
  },
  buttonTextLg: {
    fontSize: Typography.fontSize.sm,
  },
  buttonTextDefault: {
    fontSize: Typography.fontSize.xs,
  },
  buttonTextSm: {
    fontSize: 10,
  },
  buttonTextDisabled: {
    color: Palette.grey[400],
  },
});
