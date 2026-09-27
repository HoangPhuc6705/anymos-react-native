import React, { forwardRef } from 'react';
import {
  Text,
  View,
  type TextProps,
  type ViewProps,
  type TextInput,
} from 'react-native';
import AppInput, { type InputProps, cn } from './input';

export interface InputGroupRootProps extends ViewProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Container bao ngoài cho Input, Label và Description (gap: 4px từ Figma)
 */
export function InputGroupRoot({
  children,
  className,
  style,
  ...props
}: InputGroupRootProps) {
  return (
    <View className={cn('w-full flex-col gap-1', className)} style={style} {...props}>
      {children}
    </View>
  );
}

export interface InputGroupLabelProps extends TextProps {
  children?: React.ReactNode;
  required?: boolean;
  className?: string;
}

/**
 * Nhãn phía trên ô input (Open Sans 12px / leading 16px, text-foreground)
 */
export function InputGroupLabel({
  children,
  required,
  className,
  ...props
}: InputGroupLabelProps) {
  if (!children) return null;

  return (
    <Text
      className={cn(
        'font-open-sans text-xs leading-4 text-foreground ml-3',
        className
      )}
      {...props}
    >
      {children}
      {required && <Text className="text-error font-medium"> *</Text>}
    </Text>
  );
}

export interface InputGroupDescriptionProps extends TextProps {
  children?: React.ReactNode;
  error?: boolean;
  className?: string;
}

/**
 * Đoạn chú thích/mô tả hoặc thông báo lỗi bên dưới ô input (Open Sans 12px / leading 16px)
 */
export function InputGroupDescription({
  children,
  error,
  className,
  ...props
}: InputGroupDescriptionProps) {
  if (!children) return null;

  return (
    <Text
      className={cn(
        'font-open-sans text-xs leading-4 ml-3',
        error ? 'text-error font-normal' : 'text-mute-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Text>
  );
}

export interface InputGroupProps extends InputProps {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  required?: boolean;
  groupClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

/**
 * Component InputGroup trọn gói kết hợp Label + Input + Description
 * Dựa trên thiết kế Figma node 69:28 (Anymos Component Kit)
 */
const AppInputGroup = forwardRef<TextInput, InputGroupProps>(
  (
    {
      label,
      description,
      required,
      error,
      groupClassName,
      labelClassName,
      descriptionClassName,
      children,
      ...inputProps
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;
    const bottomText = errorMessage || description;

    return (
      <InputGroupRoot className={groupClassName}>
        {label && (
          <InputGroupLabel required={required} className={labelClassName}>
            {label}
          </InputGroupLabel>
        )}

        {children ?? (
          <AppInput
            ref={ref}
            error={hasError}
            {...inputProps}
          />
        )}

        {bottomText && (
          <InputGroupDescription
            error={hasError}
            className={descriptionClassName}
          >
            {bottomText}
          </InputGroupDescription>
        )}
      </InputGroupRoot>
    );
  }
);

AppInputGroup.displayName = 'AppInputGroup';

export default AppInputGroup;
export { AppInputGroup as InputGroup };
