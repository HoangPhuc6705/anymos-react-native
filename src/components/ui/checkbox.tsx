import React, { useState } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export type CheckboxSize = 'sm' | 'default' | 'lg';

export interface CheckboxProps {
  /** Checked state (controlled) */
  checked?: boolean;
  /** Initial checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Change callback */
  onChange?: (checked: boolean) => void;
  /** Optional text label next to the checkbox */
  label?: string | React.ReactNode;
  /** Optional description text under the label */
  description?: string | React.ReactNode;
  /** Size variant: 'sm' (16px box), 'default' (20px box), 'lg' (24px box) */
  size?: CheckboxSize;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean | string;
  /** Tailwind className */
  className?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom label style */
  labelStyle?: StyleProp<TextStyle>;
  /** Custom description style */
  descriptionStyle?: StyleProp<TextStyle>;
  /** Test ID for automated tests */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  label,
  description,
  size = 'default',
  disabled = false,
  error = false,
  className = '',
  style,
  labelStyle,
  descriptionStyle,
  testID,
  accessibilityLabel,
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;
  const isError = Boolean(error);

  const handlePress = (_e: GestureResponderEvent) => {
    if (disabled) return;

    const nextChecked = !isChecked;
    if (!isControlled) {
      setInternalChecked(nextChecked);
    }
    onChange?.(nextChecked);
  };

  // Size classes
  const touchTargetSizeClass =
    size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-7 h-7' : 'w-6 h-6';

  const boxSizeClass =
    size === 'sm'
      ? 'w-4 h-4 rounded-xs'
      : size === 'lg'
      ? 'w-6 h-6 rounded-md'
      : 'w-5 h-5 rounded-sm';

  const checkMarkSizeClass =
    size === 'sm'
      ? 'w-[5px] h-2 mb-[2px]'
      : size === 'lg'
      ? 'w-[7px] h-3 mb-[2px]'
      : 'w-[6px] h-[10px] mb-[2px]';

  const labelSizeClass =
    size === 'sm'
      ? 'text-sm leading-5'
      : size === 'lg'
      ? 'text-lg leading-7'
      : 'text-base leading-6';

  // Box state styles
  const boxStateClass = disabled
    ? isChecked
      ? 'bg-grey-300 border-2 border-grey-300'
      : 'bg-grey-100 border-2 border-grey-200'
    : isError
    ? isChecked
      ? 'bg-error border-2 border-error'
      : 'bg-white border-2 border-error'
    : isChecked
    ? 'bg-violet-500 border-2 border-violet-500'
    : 'bg-white border-2 border-grey-200';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled }}
      accessibilityLabel={
        accessibilityLabel || (typeof label === 'string' ? label : undefined)
      }
      disabled={disabled}
      onPress={handlePress}
      className={`flex-row items-start gap-2 ${
        disabled ? 'opacity-60' : 'active:opacity-85'
      } ${className}`}
      style={style}
    >
      {/* Checkbox box touch area */}
      <View className={`items-center justify-center ${touchTargetSizeClass}`}>
        <View
          className={`items-center justify-center ${boxSizeClass} ${boxStateClass}`}
        >
          {isChecked && (
            <View
              className={`border-b-2 border-r-2 border-white rotate-45 ${checkMarkSizeClass}`}
            />
          )}
        </View>
      </View>

      {/* Label and Description */}
      {(label || description) && (
        <View className="flex-1 justify-center">
          {label && (
            typeof label === 'string' ? (
              <Text
                className={`font-sans text-grey-900 ${labelSizeClass} ${
                  disabled ? 'text-grey-400' : ''
                }`}
                style={labelStyle}
              >
                {label}
              </Text>
            ) : (
              label
            )
          )}
          {description && (
            typeof description === 'string' ? (
              <Text
                className={`font-sans text-xs text-grey-500 leading-4 mt-0.5 ${
                  disabled ? 'text-grey-400' : ''
                }`}
                style={descriptionStyle}
              >
                {description}
              </Text>
            ) : (
              description
            )
          )}
        </View>
      )}
    </Pressable>
  );
}

export default Checkbox;
