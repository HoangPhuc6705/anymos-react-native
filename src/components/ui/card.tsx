import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Palette } from '@/constants/themes';
import { DotsIcon, HeartIcon, HeartOutlineIcon, LightbulbIcon } from './icons';

// --- Card Primitives ---

export type CardVariant = 'default' | 'violet' | 'muted' | 'outline' | 'flat';
export type CardPadding = 'none' | 'sm' | 'default' | 'lg';
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

export interface CardProps {
  /** Visual variant */
  variant?: CardVariant;
  /** Internal padding */
  padding?: CardPadding;
  /** Corner radius */
  rounded?: CardRadius;
  /** Press handler for interactive cards */
  onPress?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Card content */
  children?: React.ReactNode;
  /** Tailwind className */
  className?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border border-grey-200',
  violet: 'bg-violet-50 border border-violet-100', // Figma node #15:1043 fills=["#F5F3FF"]
  muted: 'bg-grey-50 border border-grey-200',
  outline: 'bg-transparent border border-grey-200',
  flat: 'bg-white',
};

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  default: 'p-4',
  lg: 'p-6',
};

const radiusClasses: Record<CardRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl', // 24px per Figma
  full: 'rounded-full',
};

export function Card({
  variant = 'default',
  padding = 'default',
  rounded = '2xl',
  onPress,
  disabled = false,
  children,
  className = '',
  style,
  testID,
}: CardProps) {
  const isInteractive = Boolean(onPress) && !disabled;
  const Container = isInteractive ? Pressable : View;

  return (
    <Container
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      className={`overflow-hidden ${variantClasses[variant]} ${paddingClasses[padding]} ${radiusClasses[rounded]} ${
        disabled ? 'opacity-60' : isInteractive ? 'active:opacity-90' : ''
      } ${className}`}
      style={style}
    >
      {children}
    </Container>
  );
}

// --- Card Header ---

export interface CardHeaderProps {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function CardHeader({
  title,
  description,
  avatar,
  action,
  children,
  className = '',
  style,
}: CardHeaderProps) {
  if (avatar || action) {
    return (
      <View
        className={`flex-row items-center justify-between pb-3 ${className}`}
        style={style}
      >
        <View className="flex-row items-center gap-3 flex-1">
          {avatar}
          {(title || description) && (
            <View className="flex-1 justify-center">
              {typeof title === 'string' ? (
                <Text className="font-sans-semibold text-base text-grey-950">
                  {title}
                </Text>
              ) : (
                title
              )}
              {typeof description === 'string' ? (
                <Text className="font-sans text-xs text-grey-500 mt-0.5">
                  {description}
                </Text>
              ) : (
                description
              )}
            </View>
          )}
        </View>
        {action && <View className="items-center justify-center">{action}</View>}
        {children}
      </View>
    );
  }

  return (
    <View className={`flex-col gap-1 pb-3 ${className}`} style={style}>
      {title &&
        (typeof title === 'string' ? <CardTitle>{title}</CardTitle> : title)}
      {description &&
        (typeof description === 'string' ? (
          <CardDescription>{description}</CardDescription>
        ) : (
          description
        ))}
      {children}
    </View>
  );
}

// --- Card Title ---

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<TextStyle>;
}

export function CardTitle({ children, className = '', style }: CardTitleProps) {
  return (
    <Text
      className={`font-sans-bold text-lg text-grey-950 ${className}`}
      style={style}
    >
      {children}
    </Text>
  );
}

// --- Card Description ---

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<TextStyle>;
}

export function CardDescription({
  children,
  className = '',
  style,
}: CardDescriptionProps) {
  return (
    <Text
      className={`font-sans text-sm text-grey-500 leading-5 ${className}`}
      style={style}
    >
      {children}
    </Text>
  );
}

// --- Card Content ---

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function CardContent({
  children,
  className = '',
  style,
}: CardContentProps) {
  return (
    <View className={`flex-1 py-1 ${className}`} style={style}>
      {children}
    </View>
  );
}

// --- Card Footer ---

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function CardFooter({
  children,
  className = '',
  style,
}: CardFooterProps) {
  return (
    <View
      className={`flex-row items-center pt-3 gap-3 ${className}`}
      style={style}
    >
      {children}
    </View>
  );
}

// --- PostCard (Figma Node #15:1043) ---

export interface PostCardProps {
  /** Author name (Figma: Anonymouse User) */
  authorName: string;
  /** Timestamp or caption (Figma: 1 hours ago) */
  timestamp?: string;
  /** Avatar image URL or asset source */
  avatarSource?: ImageSourcePropType | string;
  /** Content of the post */
  content: string | React.ReactNode;
  /** When true, wraps content in inner bubble card per Figma #15:1011 */
  innerBubble?: boolean;
  /** Number of likes/hearts */
  likesCount?: number;
  /** Liked state */
  isLiked?: boolean;
  /** Callback when heart/like button is pressed */
  onLikePress?: () => void;
  /** Number of thinkings / lightbulb reactions */
  thinkingsCount?: number;
  /** Callback when thinking button is pressed */
  onThinkingPress?: () => void;
  /** Callback when more button (3 dots) is pressed */
  onMorePress?: () => void;
  /** Press handler for the post card */
  onPress?: () => void;
  /** Tailwind className */
  className?: string;
  /** Style */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

export function PostCard({
  authorName,
  timestamp = 'Just now',
  avatarSource,
  content,
  innerBubble = true,
  likesCount = 0,
  isLiked = false,
  onLikePress,
  thinkingsCount = 0,
  onThinkingPress,
  onMorePress,
  onPress,
  className = '',
  style,
  testID,
}: PostCardProps) {
  return (
    <Card
      testID={testID}
      variant="violet" // #F5F3FF per Figma #15:1043
      rounded="3xl" // 24px radius per Figma
      padding="default"
      onPress={onPress}
      className={`gap-3.5 ${className}`}
      style={style}
    >
      {/* Header: Avatar, Name, Timestamp, More Options */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5 flex-1">
          <View className="w-10 h-10 rounded-full bg-violet-200 border border-grey-200 overflow-hidden items-center justify-center">
            {avatarSource ? (
              <Image
                source={
                  typeof avatarSource === 'string'
                    ? { uri: avatarSource }
                    : avatarSource
                }
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="font-sans-bold text-violet-700 text-sm">
                {authorName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <View className="flex-1 justify-center">
            <Text
              numberOfLines={1}
              className="font-sans-semibold text-sm text-grey-900"
            >
              {authorName}
            </Text>
            <Text className="font-sans text-xs text-grey-500 mt-0.5">
              {timestamp}
            </Text>
          </View>
        </View>

        {/* More 3-dots button */}
        <Pressable
          hitSlop={8}
          onPress={onMorePress}
          accessibilityRole="button"
          accessibilityLabel="Tùy chọn bài viết"
          className="w-8 h-8 items-center justify-center rounded-full active:bg-violet-100"
        >
          <DotsIcon size={20} color={Palette.grey[700]} />
        </Pressable>
      </View>

      {/* Body: Post Content (with optional inner bubble #15:1011) */}
      {innerBubble ? (
        <View className="bg-grey-200 p-5 rounded-2xl justify-center">
          {typeof content === 'string' ? (
            <Text className="font-sans text-base text-grey-900 leading-6">
              {content}
            </Text>
          ) : (
            content
          )}
        </View>
      ) : typeof content === 'string' ? (
        <Text className="font-sans text-base text-grey-900 leading-6 px-1">
          {content}
        </Text>
      ) : (
        content
      )}

      {/* Footer: Reactions (Hearts & Thinkings per Figma #129:9759) */}
      <View className="flex-row items-center gap-4 pt-1">
        {/* Heart Reaction */}
        <Pressable
          hitSlop={8}
          onPress={onLikePress}
          className="flex-row items-center gap-1.5 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel={`${likesCount} Hearts`}
        >
          {isLiked ? (
            <HeartIcon size={20} color={Palette.violet[600]} />
          ) : (
            <HeartOutlineIcon size={20} color={Palette.grey[600]} />
          )}
          <Text
            className={`font-sans-medium text-sm ${
              isLiked ? 'text-violet-600' : 'text-grey-600'
            }`}
          >
            {likesCount} {likesCount === 1 ? 'Heart' : 'Hearts'}
          </Text>
        </Pressable>

        {/* Thinking / Lightbulb Reaction */}
        <Pressable
          hitSlop={8}
          onPress={onThinkingPress}
          className="flex-row items-center gap-1.5 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel={`${thinkingsCount} Thinkings`}
        >
          <LightbulbIcon size={20} color={Palette.grey[800]} />
          <Text className="font-sans-medium text-sm text-grey-800">
            {thinkingsCount} {thinkingsCount === 1 ? 'thinking' : 'thinkings'}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

export default Card;
