import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  InputGroup,
  Item,
  PostCard,
  Switch,
} from "@/components/ui";
import { UserIcon } from "@/components/ui/icons";

export default function Index() {
  const router = useRouter();

  // Demo interactive states
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [itemSwitch, setItemSwitch] = useState(true);
  const [itemCheckbox, setItemCheckbox] = useState(false);
  const [postLiked, setPostLiked] = useState(true);
  const [likes, setLikes] = useState(12);

  const toggleLike = () => {
    if (postLiked) {
      setLikes(likes - 1);
      setPostLiked(false);
    } else {
      setLikes(likes + 1);
      setPostLiked(true);
    }
  };

  return (
    <ScrollView contentContainerClassName="p-4 pt-14 pb-10 bg-grey-50 gap-4">
      <Text className="font-sans-bold text-2xl text-grey-950 mb-1">Anymos App</Text>
      <Text className="font-sans text-sm text-grey-500 mb-2">Điều hướng tự động Expo Router</Text>

      {/* Navigation to Auth Screens */}
      <View className="bg-white p-4 rounded-2xl border border-grey-200">
        <Text className="font-sans-bold text-lg text-grey-900 mb-1.5">
          Màn hình Authentication (Figma)
        </Text>
        <Text className="font-sans text-xs text-grey-500 mb-4">
          Bấm vào để mở các frame tương ứng:
        </Text>

        <View className="gap-3">
          <Button
            size="lg"
            fullWidth
            variant="default"
            onPress={() => router.push("/login")}
          >
            1. Đăng nhập (Login)
          </Button>

          <Button
            size="lg"
            fullWidth
            variant="secondary"
            onPress={() => router.push("/register")}
          >
            2. Đăng ký (Register)
          </Button>

          <Button
            size="lg"
            fullWidth
            variant="outline"
            onPress={() => router.push("/forgot-password")}
          >
            3. Quên mật khẩu (Forgot Password)
          </Button>

          <Button
            size="lg"
            fullWidth
            variant="ghost"
            onPress={() =>
              router.push({
                pathname: "/otp-verify",
                params: { email: "user@anymos.app" },
              })
            }
          >
            4. Nhập mã OTP (Verify 4-Digits)
          </Button>
        </View>
      </View>

      {/* Card & PostCard Preview Section */}
      <View className="bg-white p-4 rounded-2xl border border-grey-200 gap-3">
        <Text className="font-sans-bold text-lg text-grey-900">
          Preview Card & PostCard (Figma #15:1043)
        </Text>
        <Text className="font-sans text-xs text-grey-500">
          Component Card theo chuẩn thiết kế mạng xã hội Anymos:
        </Text>

        {/* 1. PostCard Figma #15:1043 */}
        <PostCard
          authorName="Anonymouse User"
          timestamp="1 hours ago"
          content="Welcome! We're excited to have you here. Let's explore new possibilities together today."
          likesCount={likes}
          isLiked={postLiked}
          onLikePress={toggleLike}
          thinkingsCount={3}
          onThinkingPress={() => alert("Thả thinking thành công!")}
          onMorePress={() => alert("Mở tùy chọn bài viết")}
        />

        {/* 2. Compound Card Primitives */}
        <Text className="font-sans-semibold text-sm text-grey-700 mt-2">
          Compound Card Primitives:
        </Text>
        <Card variant="default">
          <CardHeader
            title="Thẻ thông báo"
            description="Cập nhật phiên bản mới nhất v1.0.0"
          />
          <CardContent>
            <Text className="font-sans text-sm text-grey-700 leading-5">
              Hệ thống đã cập nhật toàn bộ các component chuẩn Figma: Button, Input, Checkbox, Radio, Switch, Item, và Card.
            </Text>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="default">
              Xác nhận
            </Button>
            <Button size="sm" variant="ghost">
              Bỏ qua
            </Button>
          </CardFooter>
        </Card>
      </View>

      {/* Switch Preview Section */}
      <View className="bg-white p-4 rounded-2xl border border-grey-200 gap-3">
        <Text className="font-sans-bold text-lg text-grey-900">
          Preview Switch Component (Figma #36:6)
        </Text>
        <Text className="font-sans text-xs text-grey-500">
          Track 61x32px, Thumb 24x24px tròn, animation trượt vị trí và màu Violet:
        </Text>

        <View className="flex-row items-center justify-between py-1">
          <Text className="font-sans text-sm text-grey-900">Trạng thái Bật (ON):</Text>
          <Switch value={switch1} onValueChange={setSwitch1} />
        </View>

        <View className="flex-row items-center justify-between py-1">
          <Text className="font-sans text-sm text-grey-900">Trạng thái Tắt (OFF):</Text>
          <Switch value={switch2} onValueChange={setSwitch2} />
        </View>

        <View className="flex-row items-center justify-between py-1">
          <Text className="font-sans text-sm text-grey-500">Vô hiệu hóa (Disabled):</Text>
          <Switch value={true} disabled />
        </View>
      </View>

      {/* Item Preview Section */}
      <View className="bg-white p-4 rounded-2xl border border-grey-200 gap-3">
        <Text className="font-sans-bold text-lg text-grey-900">
          Preview Item Component (Figma #89:8)
        </Text>
        <Text className="font-sans text-xs text-grey-500">
          Chuẩn 412x80px horizontal hoặc vertical, tích hợp avatar và các action slot:
        </Text>

        {/* Item with Switch */}
        <Item
          title="Thông báo đẩy"
          description="Nhận thông báo khi có tin nhắn mới"
          action="switch"
          actionChecked={itemSwitch}
          onActionChange={setItemSwitch}
        />

        {/* Item with Checkbox */}
        <Item
          title="Ghi nhớ phiên đăng nhập"
          description="Tự động đăng nhập vào lần mở ứng dụng tiếp theo"
          action="checkbox"
          actionChecked={itemCheckbox}
          onActionChange={setItemCheckbox}
        />

        {/* Item with Button */}
        <Item
          title="Nguyễn Văn A"
          description="nva@example.com"
          action="button"
          buttonTitle="Kết bạn"
          onButtonPress={() => alert("Đã gửi lời mời kết bạn!")}
        />

        {/* Item Vertical Profile */}
        <Text className="font-sans-semibold text-sm text-grey-700 mt-2">
          Biến thể Dọc (Layout=Vertical):
        </Text>
        <Item
          layout="vertical"
          title="Nguyễn Văn A"
          description="Chuyên viên thiết kế UI/UX"
        />
      </View>

      {/* Quick Input Preview */}
      <View className="bg-white p-4 rounded-2xl border border-grey-200">
        <Text className="font-sans-bold text-lg text-grey-900 mb-3">Input & Button</Text>
        <InputGroup
          size="lg"
          label="Username"
          placeholder="Nhập tài khoản"
          leadingIcon={<UserIcon />}
        />
        <View className="h-3" />
        <Button title="Button" size="lg" fullWidth />
      </View>
    </ScrollView>
  );
}
// Test OK
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList } from 'react-native';
// import { supabase } from '../../supabase';
//
// export default function Index() {
//
//   const [data, setData] = useState<any[]>([]);
//
//   useEffect(() => {
//     async function fetchData() {
//       const { data, error } = await supabase.from('user_setting').select('*');
//
//       if (error) {
//         console.error("Lỗi lấy dữ liệu:", error);
//       } else {
//         setData(data || []);
//       }
//     }
//
//     fetchData();
//   }, []);
//
//   return (
//       <View style={{ padding: 50 }}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Dữ liệu từ Supabase:</Text>
//         <FlatList
//             data={data}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({ item }) => <Text>{JSON.stringify(item)}</Text>}
//         />
//       </View>
//   );
// }

