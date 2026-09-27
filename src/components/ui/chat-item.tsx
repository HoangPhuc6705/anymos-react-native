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

export interface ChatItemProps extends Omit<PressableProps, 'children'> {
  name: string;
  message: string;
  time: string;
  avatarUrl?: string;
  unreadCount?: number;
  className?: string;
}

/**
 * Chat Item Component (Figma node 25:73 / Conversation item)
 * Chiều cao 76px, avatar 48x48, hiển thị tên, tin nhắn cuối, thời gian và huy hiệu tin chưa đọc
 */
export function ChatItem({
  name,
  message,
  time,
  avatarUrl,
  unreadCount = 0,
  className,
  ...props
}: ChatItemProps) {
  const isUnread = unreadCount > 0;

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'w-full flex-row items-center px-4 py-3 gap-3 h-[76px] bg-background active:bg-surface-variant transition-colors',
        className
      )}
      {...props}
    >
      {/* Avatar (48x48) */}
      <View className="w-12 h-12 rounded-full overflow-hidden bg-secondary items-center justify-center shrink-0">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center bg-secondary">
            <UserIcon size={24} color="#71717A" />
          </View>
        )}
      </View>

      {/* Conversation Details */}
      <View className="flex-1 flex-col justify-center gap-1 min-w-0">
        {/* Heading: Tên & Thời gian */}
        <View className="flex-row items-center justify-between">
          <Text
            className="font-open-sans-semibold font-semibold text-base text-foreground flex-1 pr-2"
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text
            className={cn(
              'font-open-sans text-xs',
              isUnread
                ? 'text-primary font-semibold'
                : 'text-mute-foreground'
            )}
          >
            {time}
          </Text>
        </View>

        {/* Message preview & Unread badge */}
        <View className="flex-row items-center justify-between gap-2">
          <Text
            className={cn(
              'font-open-sans text-md flex-1',
              isUnread
                ? 'text-foreground font-medium'
                : 'text-mute-foreground'
            )}
            numberOfLines={1}
          >
            {message}
          </Text>

          {isUnread && (
            <View className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary border border-white dark:border-background items-center justify-center shrink-0">
              <Text className="text-white text-[10px] font-open-sans-semibold font-semibold leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default ChatItem;
