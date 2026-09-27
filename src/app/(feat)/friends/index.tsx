import { MinimalisticMagnifierIcon } from '@solar-icons/react-native/linear/minimalistic-magnifier';
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
import { FriendItem } from '@/components/ui/friend-item';
import { Header } from '@/components/ui/header';
import AppInput from '@/components/ui/input';

export type FriendFilterKey = 'all' | 'active' | 'offline';

export interface FriendData {
    id: string;
    name: string;
    avatarUrl: string;
    isOnline: boolean;
    statusText?: string;
    statusColor?: string;
}

// Mock danh sách bạn bè dựa trên thiết kế Figma (Node 30:268 & 52:270)
const FRIENDS_LIST: FriendData[] = [
    {
        id: '1',
        name: 'Hermione Granger',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        isOnline: true,
        statusText: 'Đang hoạt động',
        statusColor: '#8E51FF',
    },
    {
        id: '2',
        name: 'Sofia Ramirez',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        isOnline: true,
        statusText: 'Đang hoạt động',
        statusColor: '#8E51FF',
    },
    {
        id: '3',
        name: 'Hana Izquierdo',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
        isOnline: true,
        statusText: 'Đang hoạt động',
        statusColor: '#8E51FF',
    },
    {
        id: '4',
        name: 'Khadija Dubois',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        isOnline: false,
        statusText: 'Truy cập 15 phút trước',
        statusColor: '#71717A',
    },
    {
        id: '5',
        name: 'Jasmine Carter',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        isOnline: false,
        statusText: 'Truy cập 1 giờ trước',
        statusColor: '#71717A',
    },
    {
        id: '6',
        name: 'David Wilson',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        isOnline: true,
        statusText: 'Đang hoạt động',
        statusColor: '#8E51FF',
    },
    {
        id: '7',
        name: 'Sophia Brown',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        isOnline: true,
        statusText: 'Đang hoạt động',
        statusColor: '#8E51FF',
    },
    {
        id: '8',
        name: 'Michael Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        isOnline: false,
        statusText: 'Truy cập hôm qua',
        statusColor: '#71717A',
    },
    {
        id: '9',
        name: 'Emma Davis',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        isOnline: false,
        statusText: 'Offline',
        statusColor: '#71717A',
    },
    {
        id: '10',
        name: 'Alice Johnson',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        isOnline: true,
        statusText: 'Đang hoạt động',
        statusColor: '#8E51FF',
    },
];

const FILTER_ITEMS: { key: FriendFilterKey; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'active', label: 'Đang hoạt động' },
    { key: 'offline', label: 'Offline' },
];

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 16,
    },
});

/**
 * Friends List Screen (Figma node 30:268)
 * Màn hình danh sách bạn bè với thanh tìm kiếm "Tìm kiếm bạn bè", bộ lọc 3 trạng thái và danh sách FriendItem 80px
 */
export default function FriendsScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FriendFilterKey>('all');
    const [activeTab, setActiveTab] = useState<NavTabKey>('groups');

    // Lọc danh sách bạn bè theo từ khóa tìm kiếm và tab bộ lọc
    const filteredFriends = useMemo(() => {
        let result = FRIENDS_LIST;

        if (activeFilter === 'active') {
            result = result.filter((item) => item.isOnline);
        } else if (activeFilter === 'offline') {
            result = result.filter((item) => !item.isOnline);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((item) => item.name.toLowerCase().includes(query));
        }

        return result;
    }, [searchQuery, activeFilter]);

    const handleOpenChat = useCallback((friend: FriendData) => {
        router.push({
            pathname: '/(feat)/chatting' as any,
            params: { name: friend.name, avatar: friend.avatarUrl },
        });
    }, []);

    const handleNavChange = useCallback((tab: NavTabKey) => {
        setActiveTab(tab);
        if (tab === 'chat') {
            router.push('/(feat)/friend-chat' as any);
        } else if (tab === 'inbox') {
            router.push('/(feat)/notification' as any);
        }
    }, []);

    const renderFriendItem = useCallback(
        ({ item }: { item: FriendData }) => (
            <FriendItem
                name={item.name}
                avatarUrl={item.avatarUrl}
                isOnline={item.isOnline}
                statusColor={item.statusColor}
                showStatusDot={true}
                statusText={item.statusText}
                onPress={() => handleOpenChat(item)}
            />
        ),
        [handleOpenChat]
    );

    return (
        <View
            className="flex-1 bg-white"
            style={{ paddingTop: insets.top }}
        >
            <StatusBar style="dark" />

            {/* 1. Header (Figma node 30:269) */}
            <Header
                title="WhatsupApp"
                avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            />

            {/* 2. Danh sách bạn bè kèm Header List (Figma node 30:272) */}
            <FlatList
                data={filteredFriends}
                keyExtractor={(item) => item.id}
                renderItem={renderFriendItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                getItemLayout={(_, index) => ({
                    length: 80,
                    offset: 80 * index,
                    index,
                })}
                ListHeaderComponent={
                    <View className="flex-col gap-4 pt-4 pb-2">
                        {/* Thanh tìm kiếm bạn bè (Figma node 30:411 / Input 44px) */}
                        <View className="px-4">
                            <AppInput
                                placeholder="Tìm kiếm bạn bè"
                                size="default"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                leadingIcon={<MinimalisticMagnifierIcon size={16} />}
                            />
                        </View>

                        {/* Hàng bộ lọc 3 trạng thái: Tất cả / Đang hoạt động / Offline (Figma node 51:244) */}
                        <FilterGroup
                            items={FILTER_ITEMS}
                            activeKey={activeFilter}
                            onChange={setActiveFilter}
                        />
                    </View>
                }
            />

            {/* 3. Thanh điều hướng dưới đáy (Figma node 30:290 / Navhost) */}
            <View style={{ paddingBottom: insets.bottom }} className="bg-white">
                <Navhost
                    activeTab={activeTab}
                    onTabChange={handleNavChange}
                    chatBadge={2}
                />
            </View>
        </View>
    );
}
