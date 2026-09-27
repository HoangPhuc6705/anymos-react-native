import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  View,
  type PressableProps,
} from 'react-native';
import { type ClassNameValue, twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(clsx(inputs));
}

export const buttonVariants = cva(
  'flex-row items-center justify-center',
  {
    variants: {
      variant: {
        default: 'bg-primary active:opacity-90',
        secondary: 'bg-secondary active:opacity-80',
        outline:
          'bg-transparent border border-border active:bg-surface-variant',
        ghost:
          'bg-transparent active:bg-surface-variant',
        destructive: 'bg-destructive active:opacity-90',
        disabled: 'bg-disabled active:opacity-100',
      },
      size: {
        sm: 'h-8 px-3 gap-1',
        default: 'h-11 px-5 gap-1',
        large: 'h-14 px-5 gap-1',
      },
      combo: {
        default: '',
        'only-icon': 'p-0 aspect-square',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    compoundVariants: [
      { combo: 'only-icon', size: 'sm', className: 'w-8 h-8 px-0' },
      { combo: 'only-icon', size: 'default', className: 'w-11 h-11 px-0' },
      { combo: 'only-icon', size: 'large', className: 'w-14 h-14 px-0' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      combo: 'default',
      rounded: 'full',
    },
  }
);

export const buttonTextVariants = cva(
  'font-open-sans-semibold font-semibold text-center text-base',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        secondary: 'text-secondary-foreground',
        outline: 'text-foreground',
        ghost: 'text-foreground',
        destructive: 'text-destructive-foreground',
        disabled: 'text-disabled-foreground',
      },
      size: {
        sm: 'text-base',
        default: 'text-base',
        large: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const buttonIconSlotVariants = cva('items-center justify-center', {
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

export const buttonIconSizes = {
  sm: 16,
  default: 20,
  large: 24,
} as const;

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'disabled';

export type ButtonSize = 'sm' | 'default' | 'large' | 'small' | 'lg';
export type ButtonRounded = 'none' | 'sm' | 'default' | 'lg' | 'full';
export type ButtonCombo = 'default' | 'only-icon';

type NormalizedSize = 'sm' | 'default' | 'large';

/**
 * Lấy mã màu tương ứng cho Icon / ActivityIndicator từ token màu của project
 */
export function getButtonIconColor(
  variant: ButtonVariant = 'default',
  isDark = false
): string {
  switch (variant) {
    case 'default':
      return '#FFFFFF'; // primary-foreground
    case 'secondary':
      return isDark ? '#E4E4E7' : '#27272A'; // secondary-foreground
    case 'outline':
    case 'ghost':
      return isDark ? '#FAFAFA' : '#171717'; // foreground
    case 'destructive':
      return '#FEF2F2'; // destructive-foreground
    case 'disabled':
      return isDark ? '#52525C' : '#A1A1AA'; // disabled-foreground
    default:
      return '#FFFFFF';
  }
}

export interface ButtonProps
  extends Omit<PressableProps, 'children'>,
    Omit<VariantProps<typeof buttonVariants>, 'size'> {
  title?: string;
  children?: React.ReactNode;
  size?: ButtonSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

function normalizeSize(size?: ButtonProps['size']): NormalizedSize {
  if (size === 'small') return 'sm';
  if (size === 'lg') return 'large';
  return size ?? 'default';
}

function renderIcon(
  iconNode: React.ReactNode,
  normalizedSize: NormalizedSize,
  defaultColor: string
) {
  if (!iconNode) return null;

  if (React.isValidElement(iconNode)) {
    const iconElement = iconNode as React.ReactElement<any>;
    const defaultIconSize = buttonIconSizes[normalizedSize];
    const propsToInject: Record<string, any> = {};

    if (iconElement.props.size === undefined) {
      propsToInject.size = defaultIconSize;
    }
    if (iconElement.props.color === undefined) {
      propsToInject.color = defaultColor;
    }

    return (
      <View className={buttonIconSlotVariants({ size: normalizedSize })}>
        {React.cloneElement(iconElement, propsToInject)}
      </View>
    );
  }

  return (
    <View className={buttonIconSlotVariants({ size: normalizedSize })}>
      {iconNode}
    </View>
  );
}

export default function AppButton({
  title,
  children,
  variant = 'default',
  size = 'default',
  combo,
  rounded = 'full',
  leadingIcon,
  trailingIcon,
  icon,
  loading = false,
  disabled = false,
  className,
  textClassName,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const normalizedSize = normalizeSize(size);
  const isDisabled = disabled || variant === 'disabled' || loading;
  const effectiveVariant: ButtonVariant = disabled ? 'disabled' : variant ?? 'default';
  const effectiveCombo =
    combo ?? (icon && !title && !children ? 'only-icon' : 'default');
  const iconColor = getButtonIconColor(effectiveVariant, isDark);

  const content = children ?? (title ? (
    <View className="px-1">
      <Text
        className={cn(
          buttonTextVariants({ variant: effectiveVariant, size: normalizedSize }),
          textClassName
        )}
      >
        {title}
      </Text>
    </View>
  ) : null);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      className={cn(
        buttonVariants({
          variant: effectiveVariant,
          size: normalizedSize,
          combo: effectiveCombo,
          rounded,
        }),
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : effectiveCombo === 'only-icon' ? (
        renderIcon(icon ?? leadingIcon ?? trailingIcon ?? children, normalizedSize, iconColor)
      ) : (
        <>
          {renderIcon(leadingIcon, normalizedSize, iconColor)}
          {content}
          {renderIcon(trailingIcon, normalizedSize, iconColor)}
        </>
      )}
    </Pressable>
  );
}

export { AppButton as Button };