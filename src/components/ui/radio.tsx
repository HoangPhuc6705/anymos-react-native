import React, { createContext, useContext, useState } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export type RadioSize = 'sm' | 'default' | 'lg';

// Context for RadioGroup
interface RadioGroupContextType {
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  size?: RadioSize;
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

export interface RadioGroupProps {
  /** Selected value (controlled) */
  value?: any;
  /** Initial selected value (uncontrolled) */
  defaultValue?: any;
  /** Callback when selection changes */
  onChange?: (value: any) => void;
  /** Direction of radio items: 'column' (default) or 'row' */
  direction?: 'column' | 'row';
  /** Spacing between items */
  gap?: number;
  /** Disable all radio options in group */
  disabled?: boolean;
  /** Size for all radio options in group */
  size?: RadioSize;
  /** Radio items */
  children: React.ReactNode;
  /** Tailwind className */
  className?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export function RadioGroup({
  value: controlledValue,
  defaultValue,
  onChange,
  direction = 'column',
  gap = 12,
  disabled = false,
  size = 'default',
  children,
  className = '',
  style,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (newValue: any) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <RadioGroupContext.Provider
      value={{
        value: currentValue,
        onChange: handleChange,
        disabled,
        size,
      }}
    >
      <View
        className={`${
          direction === 'row' ? 'flex-row flex-wrap items-center' : 'flex-col'
        } ${className}`}
        style={[{ gap }, style]}
      >
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps {
  /** Value of this radio option */
  value: any;
  /** Selected state (for standalone usage outside RadioGroup) */
  selected?: boolean;
  /** Callback when selected (for standalone usage) */
  onSelect?: (value: any) => void;
  /** Optional text label next to the radio circle */
  label?: string | React.ReactNode;
  /** Optional description text under the label */
  description?: string | React.ReactNode;
  /** Size variant: 'sm' (16px circle), 'default' (20px circle), 'lg' (24px circle) */
  size?: RadioSize;
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
  /** Test ID */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Radio({
  value,
  selected: standaloneSelected,
  onSelect,
  label,
  description,
  size: propSize,
  disabled: propDisabled = false,
  error = false,
  className = '',
  style,
  labelStyle,
  descriptionStyle,
  testID,
  accessibilityLabel,
}: RadioProps) {
  const groupContext = useContext(RadioGroupContext);

  const isSelected = groupContext
    ? groupContext.value === value
    : Boolean(standaloneSelected);

  const isDisabled = groupContext?.disabled || propDisabled;
  const size = propSize || groupContext?.size || 'default';
  const isError = Boolean(error);

  const handlePress = (_e: GestureResponderEvent) => {
    if (isDisabled) return;

    if (groupContext?.onChange) {
      groupContext.onChange(value);
    } else {
      onSelect?.(value);
    }
  };

  // Size classes
  const touchTargetSizeClass =
    size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-7 h-7' : 'w-6 h-6';

  const circleSizeClass =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  const dotSizeClass =
    size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-2.5 h-2.5';

  const labelSizeClass =
    size === 'sm'
      ? 'text-sm leading-5'
      : size === 'lg'
      ? 'text-lg leading-7'
      : 'text-base leading-6';

  // Circle state styles
  const circleStateClass = isDisabled
    ? isSelected
      ? 'bg-grey-100 border-2 border-grey-300'
      : 'bg-grey-100 border-2 border-grey-200'
    : isError
    ? 'bg-white border-2 border-error'
    : isSelected
    ? 'bg-white border-2 border-violet-500'
    : 'bg-white border-2 border-grey-200';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      accessibilityLabel={
        accessibilityLabel || (typeof label === 'string' ? label : undefined)
      }
      disabled={isDisabled}
      onPress={handlePress}
      className={`flex-row items-start gap-2 ${
        isDisabled ? 'opacity-60' : 'active:opacity-85'
      } ${className}`}
      style={style}
    >
      {/* Radio outer circle */}
      <View className={`items-center justify-center ${touchTargetSizeClass}`}>
        <View
          className={`items-center justify-center rounded-pill ${circleSizeClass} ${circleStateClass}`}
        >
          {isSelected && (
            <View
              className={`rounded-pill ${dotSizeClass} ${
                isDisabled ? 'bg-grey-400' : 'bg-violet-500'
              }`}
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
                  isDisabled ? 'text-grey-400' : ''
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
                  isDisabled ? 'text-grey-400' : ''
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

export default Radio;
