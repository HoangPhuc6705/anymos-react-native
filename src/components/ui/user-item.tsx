import React from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
  type PressableProps,
} from 'react-native';
import { UserIcon } from '@solar-icons/react-native/linear/user';
import { cn } from './input';

export interface UserItemProps extends Omit<PressableProps, 'children'> {
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
  hasStory?: boolean;
  className?: string;
}

/**
 * User Item Component (Figma node 30:248 / Frame 19)
 * Thiết kế avatar tròn 56x56 px, tên người dùng bên dưới, phù hợp danh sách story / người dùng trực tuyến
 */
export function UserItem({
  name,
  avatarUrl,
  isOnline,
  hasStory,
  className,
  ...props
}: UserItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'w-[78px] flex-col items-center justify-center gap-2 active:opacity-80',
        className
      )}
      {...props}
    >
      {/* Avatar Container (56x56) */}
      <View className="relative">
        <View
          className={cn(
            'w-14 h-14 rounded-full items-center justify-center overflow-hidden bg-[#D9D9D9] dark:bg-secondary',
            hasStory && 'p-[2px] border-2 border-primary'
          )}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-[#D9D9D9] dark:bg-secondary">
              <UserIcon size={28} color="#71717A" />
            </View>
          )}
        </View>

        {/* Chấm tròn báo trạng thái Online */}
        {isOnline && (
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success border-2 border-white dark:border-background" />
        )}
      </View>

      {/* Tên người dùng */}
      <Text
        className="font-open-sans text-[17px] text-foreground text-center w-full"
        numberOfLines={2}
      >
        {name}
      </Text>
    </Pressable>
  );
}

export default UserItem;
