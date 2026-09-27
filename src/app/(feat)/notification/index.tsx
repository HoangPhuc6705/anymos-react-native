import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Navhost, type NavTabKey } from '@/components/navhost';
import { FilterGroup } from '@/components/ui/filter';
import { Header } from '@/components/ui/header';
import {
    NotificationItem,
    type NotificationType,
} from './compoennts/notification';

export interface NotificationData {
    id: string;
    actorName: string;
    actionText: string;
    content?: string;
    avatarUrl?: string;
    time: string;
    isRead: boolean;
    type: NotificationType;
    showActions?: boolean;
}

// Mock danh sách thông báo mẫu đa dạng các loại
const MOCK_NOTIFICATIONS: NotificationData[] = [
    {
        id: 'notif-1',
        actorName: 'Hermione Granger',
        actionText: 'đã gửi một tin nhắn mới cho bạn',
        content: 'Cảm ơn nhé. Khoa học lắm. Thế còn lịch của Ron thì bồ ghi gì?',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        time: '5 phút trước',
        isRead: false,
        type: 'message',
    },
    {
        id: 'notif-2',
        actorName: 'Ron Weasley',
        actionText: 'đã gửi cho bạn lời mời kết bạn',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        time: '20 phút trước',
        isRead: false,
        type: 'friend_request',
        showActions: true,
    },
    {
        id: 'notif-3',
        actorName: 'Sofia Ramirez',
        actionText: 'đã thích tin nhắn của bạn',
        content: '"Hẹn gặp lại bạn vào lúc 8 giờ tối nay tại thư viện nhé!"',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        time: '1 giờ trước',
        isRead: false,
        type: 'like',
    },
    {
        id: 'notif-4',
        actorName: 'Hana Izquierdo',
        actionText: 'đã nhắc đến bạn trong một tin nhắn nhóm',
        content: '@bồ ơi xem giúp mình cuốn Lịch sử Pháp thuật với',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
        time: '3 giờ trước',
        isRead: true,
        type: 'mention',
    },
    {
        id: 'notif-5',
        actorName: 'WhatsupApp',
        actionText: 'Chào mừng bạn đến với phiên bản cập nhật mới nhất!',
        content: 'Trải nghiệm giao diện mượt mà và các tính năng kết nối bạn bè mới.',
        time: 'Hôm qua',
        isRead: true,
        type: 'system',
    },
];

export type NotificationFilterKey = 'all' | 'unread';

const FILTER_ITEMS: { key: NotificationFilterKey; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'unread', label: 'Chưa đọc' },
];

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 16,
    },
});

/**
 * Notification Screen
 * Màn hình thông báo sử dụng NotificationItem được thiết kế dựa trên cấu trúc User Item
 */
export default function NotificationScreen() {
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
    const [activeTab, setActiveTab] = useState<NavTabKey>('inbox');
    const [notifications, setNotifications] =
        useState<NotificationData[]>(MOCK_NOTIFICATIONS);

    // Lọc thông báo theo tab (Tất cả / Chưa đọc)
    const filteredNotifications = useMemo(() => {
        if (activeFilter === 'unread') {
            return notifications.filter((item) => !item.isRead);
        }
        return notifications;
    }, [notifications, activeFilter]);

    const handleMarkAsRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
        );
    }, []);

    const handleAcceptFriend = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        isRead: true,
                        showActions: false,
                        actionText: 'đã trở thành bạn bè với bạn',
                    }
                    : item
            )
        );
    }, []);

    const handleDeclineFriend = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, isRead: true, showActions: false } : item
            )
        );
    }, []);

    const handlePressItem = useCallback(
        (item: NotificationData) => {
            handleMarkAsRead(item.id);
            if (item.type === 'message') {
                router.push({
                    pathname: '/(feat)/chatting' as any,
                    params: { name: item.actorName, avatar: item.avatarUrl },
                });
            }
        },
        [handleMarkAsRead]
    );

    const handleNavChange = useCallback((tab: NavTabKey) => {
        setActiveTab(tab);
        if (tab === 'chat') {
            router.push('/(feat)/friend-chat' as any);
        } else if (tab === 'groups') {
            router.push('/(feat)/friends' as any);
        }
    }, []);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.isRead).length,
        [notifications]
    );

    return (
        <View
            className="flex-1 bg-white"
            style={{ paddingTop: insets.top }}
        >
            <StatusBar style="dark" />

            {/* 1. Header */}
            <Header
                title="Thông báo"
                avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            />

            {/* 2. Bộ lọc & Danh sách thông báo */}
            <FlatList
                data={filteredNotifications}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View className="py-3 bg-white">
                        <FilterGroup
                            items={FILTER_ITEMS}
                            activeKey={activeFilter}
                            onChange={setActiveFilter}
                        />
                    </View>
                }
                renderItem={({ item }) => (
                    <NotificationItem
                        actorName={item.actorName}
                        actionText={item.actionText}
                        content={item.content}
                        avatarUrl={item.avatarUrl}
                        time={item.time}
                        isRead={item.isRead}
                        type={item.type}
                        showActions={item.showActions}
                        onAccept={() => handleAcceptFriend(item.id)}
                        onDecline={() => handleDeclineFriend(item.id)}
                        onPress={() => handlePressItem(item)}
                    />
                )}
            />

            {/* 3. Thanh điều hướng Navhost dưới đáy */}
            <View style={{ paddingBottom: insets.bottom }} className="bg-white">
                <Navhost
                    activeTab={activeTab}
                    onTabChange={handleNavChange}
                    inboxBadge={unreadCount}
                    chatBadge={2}
                />
            </View>
        </View>
    );
}
