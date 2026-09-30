import { AnymosLogo, ArrowLeftIcon } from '@/components/ui';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthScreenProps {
  title: string;
  description: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onBack?: () => void;
  headerIcon?: React.ReactNode;
}

export function AuthScreen({
  title,
  description,
  children,
  footer,
  onBack,
  headerIcon,
}: AuthScreenProps) {
  return (
    <View className="flex-1 bg-[#10152F]">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          contentContainerClassName="flex-grow px-5 pt-3 pb-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              className="mb-4 h-11 w-11 items-center justify-center rounded-full bg-white/10"
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
            >
              <ArrowLeftIcon size={22} color="#FFFFFF" />
            </Pressable>
          ) : null}

          <View className="mb-5 flex-row items-center gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#8E51FF]">
              <AnymosLogo width={29} height={25} />
            </View>
            <View>
              <Text className="font-open-sans-bold text-sm tracking-[1.5px] text-white">
                ANYMOS
              </Text>
              <Text className="font-open-sans text-xs text-white/55">
                Connect with your people
              </Text>
            </View>
          </View>

          <View className="rounded-[28px] bg-[#FCFCFD] px-5 pb-6 pt-7">
            <View className="mb-7">
              {headerIcon ? (
                <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-[#F0EBFF]">
                  {headerIcon}
                </View>
              ) : null}
              <Text className="font-open-sans-bold text-[28px] leading-9 text-[#18181B]">
                {title}
              </Text>
              <Text className="mt-2 font-open-sans text-[15px] leading-6 text-[#71717B]">
                {description}
              </Text>
            </View>

            {children}

            {footer ? <View className="mt-7">{footer}</View> : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
