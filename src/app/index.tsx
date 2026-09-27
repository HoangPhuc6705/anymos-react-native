import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import AppButton from '@/components/ui/button';
import { ChatRoundIcon } from '@solar-icons/react-native/bold/chat-round';
import { UsersGroupTwoRoundedIcon } from '@solar-icons/react-native/bold/users-group-two-rounded';
import { BellIcon } from '@solar-icons/react-native/bold/bell';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-6 p-6 bg-white">
      <View className="items-center gap-2">
        <Text className="text-3xl font-bold text-[#8E51FF] font-open-sans-bold">
          WhatsupApp
        </Text>
        <Text className="text-sm text-[#71717A] text-center font-open-sans">
          Thiết kế màn hình Chat từ Figma (Node 13:15)
        </Text>
      </View>

      <View className="w-full gap-3 max-w-sm">
        <AppButton
          title="Mở giao diện Chat (Hermione)"
          leadingIcon={<ChatRoundIcon size={20} color="#FFFFFF" />}
          rounded="full"
          variant="default"
          size="large"
          className="w-full"
          onPress={() => router.push('/(feat)/chatting' as any)}
        />

        <AppButton
          title="Hộp thoại tin nhắn (Conversations)"
          leadingIcon={<ChatRoundIcon size={20} color="#09090B" />}
          rounded="full"
          variant="secondary"
          size="large"
          className="w-full"
          onPress={() => router.push('/(feat)/friend-chat' as any)}
        />

        <AppButton
          title="Danh sách bạn bè (Friends List)"
          leadingIcon={<UsersGroupTwoRoundedIcon size={20} color="#09090B" />}
          rounded="full"
          variant="secondary"
          size="large"
          className="w-full"
          onPress={() => router.push('/(feat)/friends' as any)}
        />

        <AppButton
          title="Thông báo (Notifications)"
          leadingIcon={<BellIcon size={20} color="#09090B" />}
          rounded="full"
          variant="secondary"
          size="large"
          className="w-full"
          onPress={() => router.push('/(feat)/notification' as any)}
        />
      </View>
    </View>
  );
}
