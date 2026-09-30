import "@/global.css";

import { AuthProvider, useAuth } from "@/context/auth-context";
import {
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  OpenSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/open-sans";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
  });

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // Giữ splash cho tới khi đọc xong token đã lưu, tránh nháy màn Login rồi mới vào app
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // if (isLoading) {
  //   return null;
  // }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Màn gốc: tự chuyển hướng theo trạng thái đăng nhập */}
      <Stack.Screen name="index" />

      {/* Chưa đăng nhập: chỉ vào được nhóm (auth) */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      {/* Đã đăng nhập: chỉ vào được nhóm (feat).
          Đăng nhập/đăng ký/đăng xuất xong, guard đổi giá trị và app tự chuyển màn. */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(feat)" />
      </Stack.Protected>
    </Stack>
  );
}
