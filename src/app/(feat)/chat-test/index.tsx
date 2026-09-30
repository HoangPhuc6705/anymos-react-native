// src/app/(feat)/chat-test/index.tsx
// Màn hình chạy test E2E chức năng nhắn tin ngay trên thiết bị.
// Truy cập qua route /(feat)/chat-test

import React, { useCallback, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

import { runChatE2ETest } from '@/services/chat-e2e-test';

type LogEntry = {
  id: number;
  text: string;
  type: 'info' | 'success' | 'error' | 'header';
};

export default function ChatTestScreen() {
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const idRef = useRef(0);

  const addLog = useCallback(
    (text: string, type: LogEntry['type'] = 'info') => {
      setLogs((prev) => [...prev, { id: ++idRef.current, text, type }]);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    [],
  );

  const handleRunTest = useCallback(async () => {
    setRunning(true);
    setLogs([]);

    // Intercept console.log để hiện lên màn hình
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: any[]) => {
      originalLog(...args);
      const text = args.map(String).join(' ');
      const type: LogEntry['type'] = text.includes('✅')
        ? 'success'
        : text.includes('❌') || text.includes('💥')
          ? 'error'
          : text.includes('═') || text.includes('╔') || text.includes('╚')
            ? 'header'
            : 'info';
      addLog(text, type);
    };

    console.error = (...args: any[]) => {
      originalError(...args);
      addLog(args.map(String).join(' '), 'error');
    };

    console.warn = (...args: any[]) => {
      originalWarn(...args);
      addLog(args.map(String).join(' '), 'info');
    };

    try {
      await runChatE2ETest();
    } catch (err) {
      addLog(`\n💥 Test thất bại: ${err}`, 'error');
    } finally {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      setRunning(false);
    }
  }, [addLog]);

  return (
    <View className="flex-1 bg-gray-900" style={{ paddingTop: insets.top }}>
      <StatusBar style="light" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-700">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-blue-400 text-base">← Quay lại</Text>
        </Pressable>
        <Text className="text-white text-lg font-bold flex-1">
          🧪 Chat E2E Test
        </Text>
      </View>

      {/* Logs */}
      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4 py-2"
        showsVerticalScrollIndicator
      >
        {logs.map((log) => (
          <Text
            key={log.id}
            className={`text-sm font-mono mb-0.5 ${
              log.type === 'success'
                ? 'text-green-400'
                : log.type === 'error'
                  ? 'text-red-400'
                  : log.type === 'header'
                    ? 'text-yellow-300 font-bold'
                    : 'text-gray-300'
            }`}
          >
            {log.text}
          </Text>
        ))}

        {logs.length === 0 && !running && (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 text-center text-base">
              Nhấn nút bên dưới để chạy test{'\n'}nhắn tin giữa 2 user
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Run button */}
      <View
        className="px-4 py-3 border-t border-gray-700"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <Pressable
          onPress={handleRunTest}
          disabled={running}
          className={`py-3 rounded-xl items-center ${
            running ? 'bg-gray-600' : 'bg-blue-600 active:bg-blue-700'
          }`}
        >
          <Text className="text-white font-bold text-base">
            {running ? '⏳ Đang chạy test...' : '🚀 Chạy Chat E2E Test'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
