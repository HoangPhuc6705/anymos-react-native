import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Navhost, type NavTabKey } from '@/components/navhost';
import { Header } from '@/components/ui/header';
import { useAuth } from '@/context/auth-context';
import { formatRelativeTime } from '@/lib/format-time';
import { ApiError } from '@/services/api';
import {
    acceptFriendRequest,
    errorMessage,
    getPendingRequests,
    rejectFriendRequest,
    senderOf,
    type Friendship,
} from '@/services/friends';
import {
    NotificationItem,
    type NotificationType,
} from './compoennts/notification';

export interface NotificationData {
    id: string;
    /** Id của bản ghi friendship, dùng cho accept/reject */
    friendshipId: number;
    actorName: string;
    actionText: string;
    content?: string;
    avatarUrl?: string;
    time: string;
    isRead: boolean;
    type: NotificationType;
    showActions?: boolean;
}

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 16,
        flexGrow: 1,
    },
});

function toNotification(f: Friendship): NotificationData {
    const sender = senderOf(f);
    return {
        id: String(f.id),
        friendshipId: f.id,
        actorName: sender.username,
        actionText: 'đã gửi cho bạn lời mời kết bạn',
        avatarUrl: sender.avatarUrl ?? undefined,
        time: formatRelativeTime(f.createdAt),
        isRead: false,
        type: 'friend_request',
        showActions: true,
    };
}

/**
 * Notification Screen
 * Danh sách lời mời kết bạn nhận được. Chỉ tải khi màn hình được mở/focus
 * (và khi kéo để làm mới); người dùng tự quyết định chấp nhận hay từ chối từng lời mời.
 */
export default function NotificationScreen() {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<NavTabKey>('inbox');
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [busyIds, setBusyIds] = useState<number[]>([]);

    const busyRef = useRef(new Set<number>());
    const requestSeq = useRef(0);

    const loadRequests = useCallback(async () => {
        const seq = ++requestSeq.current;
        try {
            const list = await getPendingRequests();
            if (seq !== requestSeq.current) return;
            setNotifications(list.map(toNotification));
            setError(null);
        } catch (err) {
            if (seq !== requestSeq.current) return;
            setError(errorMessage(err));
        } finally {
            if (seq === requestSeq.current) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, []);

    // Mỗi lần màn hình được focus thì tải lại danh sách lời mời.
    useFocusEffect(
        useCallback(() => {
            loadRequests();
        }, [loadRequests]),
    );

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        loadRequests();
    }, [loadRequests]);

    const handleDecision = useCallback(
        async (item: NotificationData, action: 'accept' | 'reject') => {
            const { friendshipId } = item;
            if (busyRef.current.has(friendshipId)) return;
            busyRef.current.add(friendshipId);
            setBusyIds((prev) => [...prev, friendshipId]);

            try {
                if (action === 'accept') {
                    await acceptFriendRequest(friendshipId);
                } else {
                    await rejectFriendRequest(friendshipId);
                }
                setNotifications((prev) =>
                    prev.filter((n) => n.friendshipId !== friendshipId),
                );
            } catch (err) {
                if (
                    err instanceof ApiError &&
                    (err.code === 'NOT_PENDING' || err.code === 'FRIENDSHIP_NOT_FOUND')
                ) {
                    // Lời mời đã được xử lý ở nơi khác (hoặc người gửi đã hủy): tải lại danh sách
                    Alert.alert('Thông báo', 'Lời mời này không còn hiệu lực.');
                    loadRequests();
                } else {
                    Alert.alert(
                        action === 'accept'
                            ? 'Không thể chấp nhận'
                            : 'Không thể từ chối',
                        errorMessage(err),
                    );
                }
            } finally {
                busyRef.current.delete(friendshipId);
                setBusyIds((prev) => prev.filter((id) => id !== friendshipId));
            }
        },
        [loadRequests],
    );

    const handleNavChange = useCallback((tab: NavTabKey) => {
        setActiveTab(tab);
        if (tab === 'chat') {
            router.push('/(feat)/friend-chat' as any);
        } else if (tab === 'groups') {
            router.push('/(feat)/friends' as any);
        } else if (tab === 'menu') {
            router.push('/(feat)/settings' as any);
        }
    }, []);

    const renderEmpty = () => {
        if (loading) {
            return (
                <View className="items-center py-12">
                    <ActivityIndicator />
                </View>
            );
        }
        if (error) {
            return (
                <View className="items-center gap-3 px-8 py-12">
                    <Text className="font-open-sans text-center text-mute-foreground">
                        {error}
                    </Text>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => {
                            setLoading(true);
                            loadRequests();
                        }}
                        className="h-8 items-center justify-center rounded-full bg-[#E4E4E7] px-4 active:opacity-80"
                    >
                        <Text className="font-open-sans text-xs text-[#27272A]">
                            Thử lại
                        </Text>
                    </Pressable>
                </View>
            );
        }
        return (
            <View className="items-center px-8 py-12">
                <Text className="font-open-sans text-center text-mute-foreground">
                    Chưa có lời mời kết bạn nào
                </Text>
            </View>
        );
    };

    return (
        <View
            className="flex-1 bg-white"
            style={{ paddingTop: insets.top }}
        >
            <StatusBar style="dark" />

            {/* 1. Header */}
            <Header
                title="Lời mời kết bạn"
                avatarUrl={user?.avatarUrl ?? undefined}
            />

            {/* 2. Danh sách lời mời kết bạn */}
            <FlatList
                data={notifications}
                extraData={busyIds}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={renderEmpty}
                renderItem={({ item }) => {
                    const busy = busyIds.includes(item.friendshipId);
                    return (
                        <NotificationItem
                            actorName={item.actorName}
                            actionText={item.actionText}
                            content={busy ? 'Đang xử lý...' : item.content}
                            avatarUrl={item.avatarUrl}
                            time={item.time}
                            isRead={item.isRead}
                            type={item.type}
                            showActions={item.showActions && !busy}
                            onAccept={() => handleDecision(item, 'accept')}
                            onDecline={() => handleDecision(item, 'reject')}
                        />
                    );
                }}
            />

            {/* 3. Thanh điều hướng Navhost dưới đáy */}
            <View style={{ paddingBottom: insets.bottom }} className="bg-white">
                <Navhost
                    activeTab={activeTab}
                    onTabChange={handleNavChange}
                />
            </View>
        </View>
    );
}
