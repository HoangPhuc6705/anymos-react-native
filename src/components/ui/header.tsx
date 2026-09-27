import React, { memo } from 'react';
import {
  Pressable,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { Image } from 'expo-image';
import { UserIcon } from '@solar-icons/react-native/linear/user';
import { cn } from './input';

export interface HeaderProps extends ViewProps {
  title?: string;
  avatarUrl?: string;
  onAvatarPress?: () => void;
  rightElement?: React.ReactNode;
  className?: string;
}

/**
 * Header Component (Figma node 30:269 & 24:64)
 * Thanh tiêu đề hiển thị logo "WhatsupApp" màu tím #8E51FF nổi bật và avatar người dùng tròn 32x32
 */
export const Header = memo(function Header({
  title = 'WhatsupApp',
  avatarUrl,
  onAvatarPress,
  rightElement,
  className,
  style,
  ...props
}: HeaderProps) {
  return (
    <View
      className={cn(
        'w-full h-20 flex-row items-center justify-between px-4 bg-white border-b border-[#E4E4E7]/40',
        className
      )}
      style={style}
      {...props}
    >
      {/* Logo / Tên ứng dụng (Figma node 30:270) */}
      <Text className="font-open-sans-bold font-bold text-2xl tracking-tight text-[#8E51FF]">
        {title}
      </Text>

      {/* Phần tử bên phải: Avatar 32x32 (Figma node 30:271) */}
      {rightElement ?? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="User profile"
          hitSlop={8}
          onPress={onAvatarPress}
          className="w-8 h-8 rounded-full overflow-hidden bg-[#F5F3FF] items-center justify-center active:opacity-80"
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ) : (
            <UserIcon size={18} color="#71717A" />
          )}
        </Pressable>
      )}
    </View>
  );
});

export default Header;
