import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Palette, Spacing, Typography } from '@/constants/themes';
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
      <Text style={[styles.description, descriptionStyle]}>
        {description}
      </Text>
    ) : (
      description
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label and optional top description */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={styles.requiredMark}> *</Text>}
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
        <Text style={[styles.errorText, errorStyle]}>{errorMessage}</Text>
      )}
    </View>
  );
}

export default InputGroup;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 4, // 4px gap per Figma Input Group node #2:16
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.sm, // 14px
    fontWeight: '600',
    color: Palette.grey[900], // #18181B per Figma
  },
  requiredMark: {
    color: Palette.error,
  },
  description: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.xs, // 12px
    color: Palette.grey[500], // #71717B
    lineHeight: 16,
    marginBottom: 4,
  },
  errorText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.fontSize.xs, // 12px
    color: Palette.error, // #FB2C36
    lineHeight: 16,
    marginTop: 2,
    paddingHorizontal: 4,
  },
});
