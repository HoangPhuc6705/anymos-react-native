import { MinimalisticMagnifierIcon } from '@solar-icons/react-native/linear/minimalistic-magnifier';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Navhost, type NavTabKey } from '@/components/navhost';
import { ChatItem } from '@/components/ui/chat-item';
import { Header } from '@/components/ui/header';
import AppInput from '@/components/ui/input';
import { UserItem } from '@/components/ui/user-item';

// Mock dữ liệu danh sách bạn bè trực tuyến / Story từ Figma
const STORIES_USERS = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    hasStory: true,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Michael Smith',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    hasStory: true,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Sophia Brown',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    hasStory: true,
    isOnline: true,
  },
  {
    id: '4',
    name: 'David Wilson',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    hasStory: false,
    isOnline: true,
  },
  {
    id: '5',
    name: 'Emma Davis',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    hasStory: false,
    isOnline: false,
  },
];

// Mock dữ liệu danh sách hội thoại chính xác từ Figma (Node 17:894)
const CONVERSATIONS = [
  {
    id: '1',
    name: 'Sofia Ramirez',
    message: "We're having a blast!",
    time: '8:45 PM',
    unreadCount: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: '2',
    name: 'Hana Izquierdo',
    message: "We're hahaha",
    time: '8:42 PM',
    unreadCount: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  },
  {
    id: '3',
    name: 'Khadija Dubois',
    message: 'Hey, I think we can start at 8pm, wdyt?',
    time: '8:36 PM',
    unreadCount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
  },
  {
    id: '4',
    name: 'Jasmine Carter',
    message: 'How about we start at 8 PM? What do you think?',
    time: '8:30 PM',
    unreadCount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  },
  {
    id: '5',
    name: 'David Wilson',
    message: 'How about we kick things off at 8 PM? What do you think?',
    time: '8:25 PM',
    unreadCount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: '6',
    name: 'Sophia Brown',
    message: 'What do you say we start at 8 PM?',
    time: '8:15 PM',
    unreadCount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
  {
    id: '7',
    name: 'Michael Smith',
    message: 'Should we kick things off at 8 PM?',
    time: '8:00 PM',
    unreadCount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: '8',
    name: 'Emma Davis',
    message: 'What do you think about starting at 8 PM?',
    time: '7:45 PM',
    unreadCount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
];

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
  },
  storiesContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
});

/**
 * Friend Chat Screen (Figma node 17:894 / Conversation List)
 * Giao diện danh sách cuộc trò chuyện với story/người dùng trực tuyến và danh sách tin nhắn
 */
export default function FriendChatScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<NavTabKey>('chat');

  // Lọc danh sách hội thoại theo từ khóa tìm kiếm
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return CONVERSATIONS;
    const query = searchQuery.toLowerCase().trim();
    return CONVERSATIONS.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        chat.message.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleOpenChat = useCallback((name: string, avatarUrl?: string) => {
    router.push({
      pathname: '/(feat)/chatting' as any,
      params: { name, avatar: avatarUrl },
    });
  }, []);

  const handleNavChange = useCallback((tab: NavTabKey) => {
    setActiveTab(tab);
    if (tab === 'groups') {
      router.push('/(feat)/friends' as any);
    } else if (tab === 'inbox') {
      router.push('/(feat)/notification' as any);
    } else if (tab === 'menu') {
      router.push('/(feat)/settings' as any);
    }
  }, []);

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      {/* 1. Header (Figma node 24:64) */}
      <Header
        title="WhatsupApp"
        avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      />

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View className="flex-col gap-4 pt-3 pb-2">
            {/* 2. Thanh tìm kiếm (Figma node 24:135 / Input 44px) */}
            <View className="px-4">
              <AppInput
                placeholder="Tìm kiếm"
                size="default"
                value={searchQuery}
                onChangeText={setSearchQuery}
                leadingIcon={<MinimalisticMagnifierIcon size={16} />}
              />
            </View>

            {/* 3. Danh sách Story / Bạn bè trực tuyến (Figma node 30:258 / UserItem) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesContainer}
            >
              {STORIES_USERS.map((user) => (
                <UserItem
                  key={user.id}
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  isOnline={user.isOnline}
                  hasStory={user.hasStory}
                  onPress={() => handleOpenChat(user.name, user.avatarUrl)}
                />
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <ChatItem
            name={item.name}
            message={item.message}
            time={item.time}
            avatarUrl={item.avatarUrl}
            unreadCount={item.unreadCount}
            onPress={() => handleOpenChat(item.name, item.avatarUrl)}
          />
        )}
      />

      {/* 4. Thanh điều hướng dưới đáy (Figma node 30:83 / Navhost) */}
      <View style={{ paddingBottom: insets.bottom }} className="bg-white">
        <Navhost
          activeTab={activeTab}
          onTabChange={handleNavChange}
          chatBadge={4}
        />
      </View>
    </View>
  );
}
