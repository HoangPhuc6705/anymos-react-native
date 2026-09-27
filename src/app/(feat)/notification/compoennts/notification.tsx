import React, { memo } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
} from 'react-native';
import { Image } from 'expo-image';
import { UserIcon } from '@solar-icons/react-native/linear/user';
import { BellIcon } from '@solar-icons/react-native/bold/bell';
import { ChatRoundIcon } from '@solar-icons/react-native/bold/chat-round';
import { HeartIcon } from '@solar-icons/react-native/bold/heart';
import { UserPlusIcon } from '@solar-icons/react-native/bold/user-plus';
import { cn } from '@/components/ui/input';

export type NotificationType =
  | 'friend_request'
  | 'message'
  | 'mention'
  | 'like'
  | 'system';

export interface NotificationItemProps extends Omit<PressableProps, 'children'> {
  /** ID định danh thông báo */
  id?: string;
  /** Tên đối tượng gửi thông báo (ví dụ: "Hermione Granger", "Hệ thống") */
  actorName: string;
  /** Mô tả hành động (ví dụ: "đã gửi cho bạn lời mời kết bạn", "đã gửi một tin nhắn mới") */
  actionText?: string;
  /** Trích dẫn nội dung hoặc mô tả chi tiết */
  content?: string;
  /** Ảnh đại diện của người gửi */
  avatarUrl?: string;
  /** Thời gian hiển thị (ví dụ: "5 phút trước", "10:30 AM") */
  time: string;
  /** Trạng thái đã đọc hay chưa (mặc định false) */
  isRead?: boolean;
  /** Phân loại thông báo */
  type?: NotificationType;
  /** Hiển thị các nút thao tác như Chấp nhận / Từ chối lời mời */
  showActions?: boolean;
  /** Callback khi bấm Chấp nhận */
  onAccept?: () => void;
  /** Callback khi bấm Từ chối */
  onDecline?: () => void;
  /** Nhãn nút chấp nhận (mặc định "Chấp nhận") */
  acceptLabel?: string;
  /** Nhãn nút từ chối (mặc định "Từ chối") */
  declineLabel?: string;
  /** Phần tử tùy biến bên phải */
  rightElement?: React.ReactNode;
  className?: string;
}

/**
 * Render icon huy hiệu nhỏ gắn vào góc dưới Avatar dựa trên loại thông báo
 */
function renderTypeBadge(type?: NotificationType) {
  switch (type) {
    case 'friend_request':
      return (
        <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#8E51FF] items-center justify-center border-2 border-white dark:border-background">
          <UserPlusIcon size={8} color="#FFFFFF" />
        </View>
      );
    case 'message':
      return (
        <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00A6F4] items-center justify-center border-2 border-white dark:border-background">
          <ChatRoundIcon size={8} color="#FFFFFF" />
        </View>
      );
    case 'like':
      return (
        <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#FB2C36] items-center justify-center border-2 border-white dark:border-background">
          <HeartIcon size={8} color="#FFFFFF" />
        </View>
      );
    case 'mention':
      return (
        <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#FF6900] items-center justify-center border-2 border-white dark:border-background">
          <UserIcon size={8} color="#FFFFFF" />
        </View>
      );
    case 'system':
    default:
      return (
        <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#8E51FF] items-center justify-center border-2 border-white dark:border-background">
          <BellIcon size={8} color="#FFFFFF" />
        </View>
      );
  }
}

/**
 * Notification Item Component (dựa trên cấu trúc User Item & Friend Item)
 * - Avatar tròn 40x40 kèm huy hiệu phân loại ở góc dưới bên phải
 * - Tên font Open Sans SemiBold 16px phối hợp mô tả hành động
 * - Hỗ trợ hiển thị tin nhắn trích dẫn, thời gian và các nút thao tác
 * - Tối ưu hóa hiệu năng theo quy chuẩn vercel-react-native-skills
 */
export const NotificationItem = memo(function NotificationItem({
  actorName,
  actionText,
  content,
  avatarUrl,
  time,
  isRead = false,
  type = 'system',
  showActions = false,
  onAccept,
  onDecline,
  acceptLabel = 'Chấp nhận',
  declineLabel = 'Từ chối',
  rightElement,
  className,
  ...props
}: NotificationItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      className={cn(
        'w-full min-h-[80px] flex-row items-center px-4 py-3 gap-3 bg-white active:bg-secondary/30 transition-colors border-b border-[#E4E4E7]/30',
        !isRead ? 'bg-[#8E51FF]/[0.03]' : undefined,
        className
      )}
      {...props}
    >
      {/* 1. Avatar 40x40 kèm Type Badge (kế thừa từ User Item) */}
      <View className="relative w-10 h-10 flex-shrink-0 self-start mt-0.5">
        <View className="w-10 h-10 rounded-full overflow-hidden bg-[#F5F3FF] items-center justify-center">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ) : (
            <UserIcon size={20} color="#71717A" />
          )}
        </View>

        {/* Huy hiệu loại thông báo */}
        {renderTypeBadge(type)}
      </View>

      {/* 2. Chi tiết nội dung thông báo */}
      <View className="flex-1 flex-col justify-center gap-1">
        {/* Dòng tên người gửi & hành động */}
        <Text className="text-base leading-6">
          <Text className="font-open-sans-semibold font-semibold text-[#09090B]">
            {actorName}{' '}
          </Text>
          {actionText ? (
            <Text className="font-open-sans font-normal text-[#52525C]">
              {actionText}
            </Text>
          ) : null}
        </Text>

        {/* Nội dung chi tiết hoặc trích dẫn tin nhắn nếu có */}
        {content ? (
          <Text
            numberOfLines={2}
            className="font-open-sans font-normal text-xs leading-4 text-[#71717A] bg-secondary/40 p-2 rounded-lg mt-0.5"
          >
            {content}
          </Text>
        ) : null}

        {/* Nút hành động nhanh (ví dụ: kết bạn) */}
        {showActions ? (
          <View className="flex-row items-center gap-2 mt-1">
            <Pressable
              accessibilityRole="button"
              hitSlop={6}
              onPress={onAccept}
              className="h-8 px-4 rounded-full bg-[#8E51FF] items-center justify-center active:opacity-80"
            >
              <Text className="font-open-sans-semibold font-semibold text-xs text-white">
                {acceptLabel}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              hitSlop={6}
              onPress={onDecline}
              className="h-8 px-4 rounded-full bg-[#E4E4E7] items-center justify-center active:opacity-80"
            >
              <Text className="font-open-sans font-normal text-xs text-[#27272A]">
                {declineLabel}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Thời gian */}
        <Text className="font-open-sans font-normal text-[11px] text-[#A1A1AA] mt-0.5">
          {time}
        </Text>
      </View>

      {/* 3. Phần tử bên phải: Chấm xanh/tím chưa đọc hoặc slot tùy biến */}
      {rightElement !== undefined ? (
        rightElement
      ) : !isRead ? (
        <View className="w-2 h-2 rounded-full bg-[#8E51FF] flex-shrink-0 self-center" />
      ) : null}
    </Pressable>
  );
});

export default NotificationItem;
