import React, { memo } from 'react';
import { View, type DimensionValue, type ViewProps } from 'react-native';
import { Image } from 'expo-image';
import { UserIcon } from '@solar-icons/react-native/linear/user';
import { cn } from '@/components/ui/input';
import { MessageBubble } from './message';

export interface MessageGroupItemProps extends ViewProps {
  /** ÄÆ°á»ng dáº«n áº£nh avatar ngÆ°á»i gá»­i */
  avatarUrl?: string;
  /** Danh sÃ¡ch tin nháº¯n dáº¡ng text náº¿u truyá»n máº£ng */
  messages?: string[];
  /** Custom children (cÃ¡c MessageBubble) náº¿u khÃ´ng dÃ¹ng máº£ng messages */
  children?: React.ReactNode;
  /** Giá»›i háº¡n chiá»u ngang tá»‘i Ä‘a cho cáº£ cá»¥m tin nháº¯n kÃ¨m avatar (máº·c Ä‘á»‹nh '78%' theo chuáº©n Figma) */
  maxWidth?: DimensionValue;
  className?: string;
}

const DEFAULT_GROUP_MAX_WIDTH: DimensionValue = '78%';

/**
 * MessageGroupItem Component (Figma node 13:685 / 13:671 / 13:754)
 * Cá»¥m tin nháº¯n nháº­n gá»“m avatar ngÆ°á»i gá»­i (44x44) bÃªn trÃ¡i vÃ  danh sÃ¡ch bong bÃ³ng chat xáº¿p chá»“ng vá»›i gap 10px
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
      {/* Avatar ngÆ°á»i gá»­i 44x44 (Figma node 13:667) */}
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

      {/* Cá»™t cÃ¡c tin nháº¯n con (gap 10px / Figma node 13:670 Slot) */}
      <View className="flex-1 flex-col gap-2.5 items-start">
        {messages
          ? messages.map((msg, index) => (
              <MessageBubble
                key={`group-msg-${index}`}
                text={msg}
                variant="secondary"
                maxWidth="100%"
              />
            ))
          : children}
      </View>
    </View>
  );
});

export default MessageGroupItem;

