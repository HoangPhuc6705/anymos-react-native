import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Input, InputProps } from './input';

export interface InputGroupProps extends Partial<InputProps> {
  /** Label for the input (Figma: Label) */
  label?: string | React.ReactNode;
  /** Description or helper text for the input */
  description?: string | React.ReactNode;
  /** Position of the description text */
  descriptionPosition?: 'top' | 'bottom';
  /** Displays a red asterisk next to the label */
  required?: boolean;
  /** Error message to display under the input */
  error?: string | boolean;
  /** Custom children (e.g. custom Input component) */
  children?: React.ReactNode;
  /** Tailwind className */
  className?: string;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Label style */
  labelStyle?: StyleProp<TextStyle>;
  /** Description style */
  descriptionStyle?: StyleProp<TextStyle>;
  /** Error style */
  errorStyle?: StyleProp<TextStyle>;
}

export function InputGroup({
  label,
  description,
  descriptionPosition = 'top',
  required = false,
  error,
  children,
  className = '',
  containerStyle,
  labelStyle,
  descriptionStyle,
  errorStyle,
  ...inputProps
}: InputGroupProps) {
  const errorMessage = typeof error === 'string' ? error : undefined;
  const hasError = Boolean(error);

  const renderDescription = () => {
    if (!description) return null;
    return typeof description === 'string' ? (
      <Text
        className="font-sans text-xs text-grey-500 leading-4 mb-1"
        style={descriptionStyle}
      >
        {description}
      </Text>
    ) : (
      description
    );
  };

  return (
    <View className={`w-full gap-1 ${className}`} style={containerStyle}>
      {/* Label and optional top description */}
      {label && (
        <View className="flex-row items-center mb-0.5">
          <Text
            className="font-sans-semibold text-sm text-grey-900"
            style={labelStyle}
          >
            {label}
            {required && <Text className="text-error font-sans-semibold"> *</Text>}
          </Text>
        </View>
      )}

      {descriptionPosition === 'top' && renderDescription()}

      {/* Input slot */}
      {children ? (
        children
      ) : (
        <Input error={hasError} {...(inputProps as InputProps)} />
      )}

      {descriptionPosition === 'bottom' && renderDescription()}

      {/* Error message */}
      {errorMessage && (
        <Text
          className="font-sans text-xs text-error leading-4 mt-0.5 px-1"
          style={errorStyle}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

export default InputGroup;
