import React, { memo, useState } from 'react';
import {
  Pressable,
  TextInput,
  View,
  type ViewProps,
} from 'react-native';
import { GalleryIcon } from '@solar-icons/react-native/linear/gallery';
import { SmileCircleIcon } from '@solar-icons/react-native/linear/smile-circle';
import { PlaneIcon } from '@solar-icons/react-native/linear/plane';
import { cn } from '@/components/ui/input';

export interface InputChatProps extends ViewProps {
  /** Giá trị tin nhắn đang nhập (khi dùng controlled component) */
  value?: string;
  /** Callback khi thay đổi nội dung tin nhắn */
  onChangeText?: (text: string) => void;
  /** Callback khi gửi tin nhắn */
  onSend?: (message: string) => void;
  /** Placeholder cho ô nhập liệu (mặc định "Enter message") */
  placeholder?: string;
  /** Callback khi bấm icon thư viện ảnh */
  onGalleryPress?: () => void;
  /** Callback khi bấm icon biểu tượng cảm xúc */
  onEmojiPress?: () => void;
  className?: string;
}

/**
 * InputChat Component (Figma node 13:16)
 * Thanh công cụ nhập tin nhắn gồm nút Gallery, nút Emoji, ô nhập text bo tròn pill 44px và nút Gửi hình máy bay giấy
 */
export const InputChat = memo(function InputChat({
  value,
  onChangeText,
  onSend,
  placeholder = 'Enter message',
  onGalleryPress,
  onEmojiPress,
  className,
  style,
  ...props
}: InputChatProps) {
  const [internalText, setInternalText] = useState('');

  const isControlled = value !== undefined;
  const currentText = isControlled ? value : internalText;

  const handleTextChange = (text: string) => {
    if (!isControlled) {
      setInternalText(text);
    }
    onChangeText?.(text);
  };

  const handleSend = () => {
    const trimmed = currentText.trim();
    if (!trimmed) return;

    onSend?.(trimmed);

    if (!isControlled) {
      setInternalText('');
    }
  };

  const hasContent = currentText.trim().length > 0;

  return (
    <View
      className={cn(
        'w-full h-14 flex-row items-center px-4 gap-2 bg-white border-t border-[#E4E4E7]/40',
        className
      )}
      style={style}
      {...props}
    >
      {/* Nút Thư viện ảnh (44x44 circular button / Figma node 13:526) */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Attach media"
        hitSlop={8}
        onPress={onGalleryPress}
        className="w-11 h-11 rounded-full items-center justify-center active:bg-secondary/40"
      >
        <GalleryIcon size={20} color="#09090B" />
      </Pressable>

      {/* Nút Biểu tượng cảm xúc / Emoji (44x44 circular button / Figma node 13:549) */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Insert emoji"
        hitSlop={8}
        onPress={onEmojiPress}
        className="w-11 h-11 rounded-full items-center justify-center active:bg-secondary/40"
      >
        <SmileCircleIcon size={20} color="#09090B" />
      </Pressable>

      {/* Ô nhập tin nhắn (Input pill 44px / Figma node 13:609) */}
      <View className="flex-1 h-11 px-4 flex-row items-center rounded-full border border-[#E4E4E7] bg-white">
        <TextInput
          value={currentText}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#71717A"
          onSubmitEditing={handleSend}
          returnKeyType="send"
          className="flex-1 h-full font-open-sans text-base text-[#09090B] p-0"
        />
      </View>

      {/* Nút Gửi (44x44 circular button / Figma node 13:617) */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Send message"
        hitSlop={8}
        onPress={handleSend}
        className={cn(
          'w-11 h-11 rounded-full items-center justify-center active:bg-secondary/40 transition-colors',
          hasContent ? 'bg-primary/10' : undefined
        )}
      >
        <PlaneIcon
          size={20}
          color={hasContent ? '#8E51FF' : '#09090B'}
        />
      </Pressable>
    </View>
  );
});

export default InputChat;
