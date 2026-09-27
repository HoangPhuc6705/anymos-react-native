import React, { memo } from 'react';
import {
  Text,
  View,
  type DimensionValue,
  type TextStyle,
  type ViewProps,
} from 'react-native';
import { cn } from '@/components/ui/input';

export interface MessageBubbleProps extends ViewProps {
  /** Nội dung tin nhắn dạng văn bản */
  text?: string;
  /** Custom children nếu có nội dung phức tạp */
  children?: React.ReactNode;
  /** Kiểu bong bóng: 'primary' (màu tím #8E51FF từ Figma) hoặc 'secondary' */
  variant?: 'sent' | 'received' | 'primary' | 'secondary';
  /** Giới hạn chiều ngang tối đa (mặc định '75%' theo chuẩn Figma) */
  maxWidth?: DimensionValue;
  /** Tùy biến style cho phần văn bản */
  textStyle?: TextStyle;
  className?: string;
}

const DEFAULT_BUBBLE_MAX_WIDTH: DimensionValue = '75%';

/**
 * Message Component (Figma node 13:663 / 13:662)
 * Bong bóng chat màu tím chủ đạo (#8E51FF), chữ trắng, bo tròn 24px với padding 10px 16px
 */
export const MessageBubble = memo(function MessageBubble({
  text,
  children,
  variant = 'primary',
  maxWidth,
  textStyle,
  className,
  style,
  ...props
}: MessageBubbleProps) {
  const isSecondary = variant === 'secondary';
  const effectiveMaxWidth = maxWidth !== undefined ? maxWidth : DEFAULT_BUBBLE_MAX_WIDTH;

  return (
    <View
      className={cn(
        'px-4 py-2.5 rounded-[24px]',
        isSecondary ? 'bg-secondary' : 'bg-[#8E51FF]',
        className
      )}
      style={[{ maxWidth: effectiveMaxWidth }, style]}
      {...props}
    >
      {text ? (
        <Text
          className={cn(
            'font-open-sans font-normal text-[18px] leading-[26px]',
            isSecondary ? 'text-[#09090B]' : 'text-white'
          )}
          style={textStyle}
        >
          {text}
        </Text>
      ) : (
        children
      )}
    </View>
  );
});

export default MessageBubble;
