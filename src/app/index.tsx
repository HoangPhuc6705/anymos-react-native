// src/app/index.tsx
import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: khi có auth state thật (vd: check access_token/refresh_token trong SecureStore):
  // const { isAuthenticated, isLoading } = useAuth();
  // if (isLoading) return <SplashScreen />; // hoặc null, đợi SplashScreen.hideAsync()
  // return isAuthenticated
  //   ? <Redirect href={'/(feat)/friend-chat' as any} />
  //   : <Redirect href={'/(auth)/login' as any} />;

  // Hiện tại chưa có auth state -> luôn vào Login trước
  return <Redirect href={'/(auth)/login' as any} />;
}