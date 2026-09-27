import React, { memo } from 'react';
import {
  Pressable,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeftIcon } from '@solar-icons/react-native/linear/arrow-left';
import { MenuDotsIcon } from '@solar-icons/react-native/bold/menu-dots';
import { cn } from '@/components/ui/input';

export interface ChatHeaderProps extends ViewProps {
  /** Tên bạn bè / đối phương (mặc định "Hermione Granger") */
  title?: string;
  /** Trạng thái người dùng (mặc định "Online") */
  status?: string;
  /** Có đang online không (hiển thị chấm xanh lá #00C950) */
  isOnline?: boolean;
  /** Sự kiện khi bấm nút Back */
  onBack?: () => void;
  /** Sự kiện khi bấm nút Menu (3 chấm) */
  onMenuPress?: () => void;
  className?: string;
}

/**
 * Chat Header Component (Figma node 13:7)
 * Thanh header cuộc trò chuyện bao gồm nút Back tròn 44px, tên đối phương, trạng thái online và nút Menu 3 chấm tròn 44px
 */
export const ChatHeader = memo(function ChatHeader({
  title = 'Hermione Granger',
  status = 'Online',
  isOnline = true,
  onBack,
  onMenuPress,
  className,
  style,
  ...props
}: ChatHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      className={cn(
        'w-full h-20 flex-row items-center justify-between px-4 bg-white border-b border-[#E4E4E7]/40',
        className
      )}
      style={style}
      {...props}
    >
      {/* Nút Back (44x44 rounded-full / Figma node 13:206) */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={8}
        onPress={handleBack}
        className="w-11 h-11 rounded-full items-center justify-center active:bg-secondary/40"
      >
        <ArrowLeftIcon size={20} color="#09090B" />
      </Pressable>

      {/* Thông tin đối phương: Tên & Trạng thái Online (Figma node 13:266) */}
      <View className="flex-1 items-center justify-center px-2">
        <Text
          numberOfLines={1}
          className="font-open-sans-semibold font-semibold text-base text-[#09090B] text-center"
        >
          {title}
        </Text>
        <View className="flex-row items-center justify-center gap-2 mt-0.5">
          {isOnline ? (
            <View className="w-2 h-2 rounded-full bg-[#00C950]" />
          ) : null}
          <Text className="font-open-sans text-xs text-[#09090B]">
            {status}
          </Text>
        </View>
      </View>

      {/* Nút Menu Dots (44x44 rounded-full / Figma node 13:252) */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Chat options"
        hitSlop={8}
        onPress={onMenuPress}
        className="w-11 h-11 rounded-full items-center justify-center active:bg-secondary/40"
      >
        <MenuDotsIcon size={20} color="#09090B" />
      </Pressable>
    </View>
  );
});

export default ChatHeader;
