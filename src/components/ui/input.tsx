import React, { forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import {
  TextInput,
  View,
  Text,
  Platform,
  useColorScheme,
  type TextInputProps,
} from 'react-native';
import { type ClassNameValue, twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(clsx(inputs));
}

export const inputContainerVariants = cva(
  'flex-row items-center px-4 gap-3 rounded-full bg-transparent outline-none',
  {
    variants: {
      size: {
        sm: 'h-8',
        default: 'h-11',
        large: 'h-14',
      },
      state: {
        default: 'border border-border',
        focus: 'border-2 border-primary',
        error: 'border-2 border-error',
        disabled: 'border border-disabled bg-disabled/20 opacity-60',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

export const inputTextVariants = cva(
  'flex-1 h-full font-open-sans text-foreground p-0 outline-none focus:outline-none focus-visible:outline-none',
  {
  variants: {
    size: {
      sm: 'text-sm',
      default: 'text-base',
      large: 'text-base',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const inputIconSlotVariants = cva('items-center justify-center', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      default: 'w-5 h-5',
      large: 'w-6 h-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const inputIconSizes = {
  sm: 16,
  default: 20,
  large: 24,
} as const;

export type InputSize = 'sm' | 'default' | 'large' | 'small' | 'lg';
export type InputState = 'default' | 'focus' | 'error' | 'disabled';

type NormalizedInputSize = 'sm' | 'default' | 'large';

function normalizeInputSize(size?: InputSize): NormalizedInputSize {
  if (size === 'small') return 'sm';
  if (size === 'lg') return 'large';
  return size ?? 'default';
}

export interface InputProps
  extends Omit<TextInputProps, 'size'>,
    Omit<VariantProps<typeof inputContainerVariants>, 'size' | 'state'> {
  size?: InputSize;
  state?: InputState;
  error?: boolean | string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  className?: string;
}

function renderInputIcon(
  iconNode: React.ReactNode,
  normalizedSize: NormalizedInputSize,
  defaultColor: string
) {
  if (!iconNode) return null;

  if (React.isValidElement(iconNode)) {
    const iconElement = iconNode as React.ReactElement<any>;
    const defaultIconSize = inputIconSizes[normalizedSize];
    const propsToInject: Record<string, any> = {};

    if (iconElement.props.size === undefined) {
      propsToInject.size = defaultIconSize;
    }
    if (iconElement.props.color === undefined) {
      propsToInject.color = defaultColor;
    }

    return (
      <View className={inputIconSlotVariants({ size: normalizedSize })}>
        {React.cloneElement(iconElement, propsToInject)}
      </View>
    );
  }

  return (
    <View className={inputIconSlotVariants({ size: normalizedSize })}>
      {iconNode}
    </View>
  );
}

const AppInput = forwardRef<TextInput, InputProps>(
  (
    {
      size = 'default',
      state,
      error,
      leadingIcon,
      trailingIcon,
      containerClassName,
      inputClassName,
      className,
      editable = true,
      placeholderTextColor,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const normalizedSize = normalizeInputSize(size);
    const hasError = Boolean(error);
    const isDisabled = editable === false;

    const effectiveState: InputState = isDisabled
      ? 'disabled'
      : (state ?? (hasError ? 'error' : isFocused ? 'focus' : 'default'));

    const defaultPlaceholderColor = isDark ? '#9F9FA9' : '#71717A'; // mute-foreground
    const iconColor =
      effectiveState === 'error'
        ? '#FB2C36' // error
        : effectiveState === 'focus'
        ? '#8E51FF' // primary
        : isDark
        ? '#9F9FA9'
        : '#71717A';

    return (
      <View className="w-full">
        <View
          className={cn(
            inputContainerVariants({
              size: normalizedSize,
              state: effectiveState,
            }),
            containerClassName,
            className
          )}
        >
          {renderInputIcon(leadingIcon, normalizedSize, iconColor)}

          <TextInput
            ref={ref}
            editable={editable}
            placeholderTextColor={placeholderTextColor ?? defaultPlaceholderColor}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            style={[
              Platform.select({
                web: {
                  outlineStyle: 'none',
                  boxShadow: 'none',
                } as any,
              }),
              props.style,
            ]}
            className={cn(
              inputTextVariants({ size: normalizedSize }),
              inputClassName
            )}
            {...props}
          />

          {renderInputIcon(trailingIcon, normalizedSize, iconColor)}
        </View>

        {typeof error === 'string' && error.length > 0 && (
          <Text className="text-error text-xs mt-1 ml-4 font-normal">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

AppInput.displayName = 'AppInput';

export default AppInput;
export { AppInput as Input };