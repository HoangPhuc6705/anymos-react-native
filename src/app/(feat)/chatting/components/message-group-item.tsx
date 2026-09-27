import React, { memo } from 'react';
import { View, type DimensionValue, type ViewProps } from 'react-native';
import { Image } from 'expo-image';
import { UserIcon } from '@solar-icons/react-native/linear/user';
import { cn } from '@/components/ui/input';
import { MessageBubble } from './message';

export interface MessageGroupItemProps extends ViewProps {
  /** Đường dẫn ảnh avatar người gửi */
  avatarUrl?: string;
  /** Danh sách tin nhắn dạng text nếu truyền mảng */
  messages?: string[];
  /** Custom children (các MessageBubble) nếu không dùng mảng messages */
  children?: React.ReactNode;
  /** Giới hạn chiều ngang tối đa cho cả cụm tin nhắn kèm avatar (mặc định '78%' theo chuẩn Figma) */
  maxWidth?: DimensionValue;
  className?: string;
}

const DEFAULT_GROUP_MAX_WIDTH: DimensionValue = '78%';

/**
 * MessageGroupItem Component (Figma node 13:685 / 13:671 / 13:754)
 * Cụm tin nhắn nhận gồm avatar người gửi (44x44) bên trái và danh sách bong bóng chat xếp chồng với gap 10px
 */
export const MessageGroupItem = memo(function MessageGroupItem({
  avatarUrl,
  messages,
  children,
  maxWidth,
  className,
  style,
  ...props
}: MessageGroupItemProps) {
  const effectiveMaxWidth = maxWidth !== undefined ? maxWidth : DEFAULT_GROUP_MAX_WIDTH;

  return (
    <View
      className={cn('flex-row gap-4 items-start', className)}
      style={[{ maxWidth: effectiveMaxWidth }, style]}
      {...props}
    >
      {/* Avatar người gửi 44x44 (Figma node 13:667) */}
      <View className="w-11 h-11 rounded-full overflow-hidden bg-[#D9D9D9] items-center justify-center flex-shrink-0">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: 44, height: 44, borderRadius: 22 }}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        ) : (
          <UserIcon size={22} color="#71717A" />
        )}
      </View>

      {/* Cột các tin nhắn con (gap 10px / Figma node 13:670 Slot) */}
      <View className="flex-1 flex-col gap-2.5 items-start">
        {messages
          ? messages.map((msg, index) => (
              <MessageBubble
                key={`group-msg-${index}`}
                text={msg}
                variant="primary"
                maxWidth="100%"
              />
            ))
          : children}
      </View>
    </View>
  );
});

export default MessageGroupItem;
