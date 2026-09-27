import React, { memo } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { cn } from './input';

export interface FilterChipProps {
  /** Nhãn hiển thị của bộ lọc (ví dụ "Tất cả", "Đang hoạt động", "Offline") */
  label: string;
  /** Trạng thái kích hoạt (true: nền tím #8E51FF chữ trắng, false: nền xám #E4E4E7 chữ xám đậm) */
  isActive?: boolean;
  /** Sự kiện khi bấm vào chip */
  onPress?: () => void;
  className?: string;
}

/**
 * FilterChip Component (Figma node 51:241 & 51:242)
 * Chip lọc 44px dạng pill bo tròn 9999px:
 * - Active (51:241): Nền tím #8E51FF, font Open Sans SemiBold 16px, chữ trắng #FFFFFF
 * - Inactive (51:242): Nền xám #E4E4E7, font Open Sans Regular 16px, chữ xám #27272A
 */
export const FilterChip = memo(function FilterChip({
  label,
  isActive = false,
  onPress,
  className,
}: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      hitSlop={8}
      onPress={onPress}
      className={cn(
        'h-11 px-4 rounded-full flex-row items-center justify-center active:opacity-85 transition-colors',
        isActive ? 'bg-[#8E51FF]' : 'bg-[#E4E4E7]',
        className
      )}
    >
      <Text
        className={cn(
          'text-base leading-6 text-center',
          isActive
            ? 'font-open-sans-semibold font-semibold text-white'
            : 'font-open-sans font-normal text-[#27272A]'
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
});

export interface FilterItem<T extends string = string> {
  key: T;
  label: string;
}

export interface FilterGroupProps<T extends string = string> extends ViewProps {
  /** Danh sách các tùy chọn lọc */
  items: FilterItem<T>[];
  /** Khóa của tab đang kích hoạt */
  activeKey: T;
  /** Callback khi người dùng chuyển đổi bộ lọc */
  onChange: (key: T) => void;
  /** Bật cuộn ngang nếu nhiều mục (mặc định true) */
  scrollable?: boolean;
  className?: string;
}

/**
 * FilterGroup Component (Figma node 51:244)
 * Hàng chứa các chip bộ lọc với khoảng cách 16px và padding 0 16px
 */
export function FilterGroup<T extends string = string>({
  items,
  activeKey,
  onChange,
  scrollable = false,
  className,
  style,
  ...props
}: FilterGroupProps<T>) {
  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        className={cn('w-full py-1', className)}
      >
        {items.map((item) => (
          <FilterChip
            key={item.key}
            label={item.label}
            isActive={activeKey === item.key}
            onPress={() => onChange(item.key)}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View
      className={cn('w-full flex-row items-center px-4 gap-4', className)}
      style={style}
      {...props}
    >
      {items.map((item) => (
        <FilterChip
          key={item.key}
          label={item.label}
          isActive={activeKey === item.key}
          onPress={() => onChange(item.key)}
        />
      ))}
    </View>
  );
}

export default FilterGroup;
