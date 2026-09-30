import { UserIcon } from "@solar-icons/react-native/linear/user";
import { Image } from "expo-image";
import React, { memo } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import { cn } from "./input";

export interface FriendItemProps extends Omit<PressableProps, "children"> {
  /** ID người dùng */
  id?: string;
  /** Tên người dùng / bạn bè */
  name: string;
  /** Ảnh đại diện */
  avatarUrl?: string;
  /** Dòng trạng thái hoặc mô tả phụ bên dưới tên (tùy chọn) */
  statusText?: string;
  rightElement?: React.ReactNode;
  className?: string;
}

/**
 * Friend Item Component (Figma node 52:270 / User Item)
 * Danh sách người dùng dạng hàng 80px với avatar tròn 40x40 và tên font Open Sans SemiBold 16px
 */
export const FriendItem = memo(function FriendItem({
  name,
  avatarUrl,
  statusText,
  rightElement,
  className,
  ...props
}: FriendItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      hitSlop={8}
      className={cn(
        "w-full h-20 flex-row items-center px-4 py-3 gap-3 bg-white active:bg-secondary/30 transition-colors",
        className,
      )}
      {...props}
    >
      {/* 1. Avatar Container 40x40 */}
      <View className="w-10 h-10 flex-shrink-0">
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
      </View>

      {/* 2. Chi tiết người dùng: Tên & Trạng thái phụ */}
      <View className="flex-1 flex-col justify-center gap-1">
        <Text
          numberOfLines={1}
          className="font-open-sans-semibold font-semibold text-base leading-[24px] text-[#09090B]"
        >
          {name}
        </Text>
        {statusText ? (
          <Text
            numberOfLines={1}
            className="font-open-sans font-normal text-sm text-[#71717A]"
          >
            {statusText}
          </Text>
        ) : null}
      </View>

      {rightElement}
    </Pressable>
  );
});

export default FriendItem;
