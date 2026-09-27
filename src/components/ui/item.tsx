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
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Radio } from './radio';
import { Switch } from './switch';

export type ItemLayout = 'horizontal' | 'vertical';

export type ItemActionType =
  | 'none'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'button';

export interface ItemProps {
  /** Primary label / title (Figma: Name) */
  title: string | React.ReactNode;
  /** Subtitle or description (Figma: Supporting text) */
  description?: string | React.ReactNode;
  /** Layout direction: 'horizontal' (80px row) or 'vertical' (profile card) */
  layout?: ItemLayout;
  /** Action type placed on the trailing edge (Figma: Action) */
  action?: ItemActionType;
  /** Controls if avatar/image slot is displayed (Figma: Show image) */
  showImage?: boolean;
  /** Avatar image URL or local asset source */
  avatarSource?: ImageSourcePropType | string;
  /** Custom icon or element inside avatar slot */
  leadingIcon?: React.ReactNode;
  /** Entirely custom leading component */
  leading?: React.ReactNode;
  /** Entirely custom trailing component (overrides action) */
  trailing?: React.ReactNode;
  /** Action state for radio/checkbox/switch */
  actionChecked?: boolean;
  /** Action value for radio button */
  actionValue?: any;
  /** Callback when radio/checkbox/switch state changes */
  onActionChange?: (checked: boolean) => void;
  /** Text on trailing action button (default: "Button") */
  buttonTitle?: string;
  /** Callback when trailing action button is pressed */
  onButtonPress?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Press handler for the entire item */
  onPress?: () => void;
  /** Tailwind className for outer container */
  className?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom title style */
  titleStyle?: StyleProp<TextStyle>;
  /** Custom description style */
  descriptionStyle?: StyleProp<TextStyle>;
  /** Test ID */
  testID?: string;
}

export function Item({
  title,
  description,
  layout = 'horizontal',
  action = 'none',
  showImage = true,
  avatarSource,
  leadingIcon,
  leading,
  trailing,
  actionChecked = false,
  actionValue,
  onActionChange,
  buttonTitle = 'Button',
  onButtonPress,
  disabled = false,
  onPress,
  className = '',
  style,
  titleStyle,
  descriptionStyle,
  testID,
}: ItemProps) {
  // Render avatar / leading graphic
  const renderLeading = () => {
    if (leading) return leading;
    if (!showImage) return null;

    const avatarDimensions =
      layout === 'vertical' ? 'w-24 h-24' : 'w-12 h-12';

    return (
      <View
        className={`${avatarDimensions} rounded-full border border-grey-200 bg-grey-100 items-center justify-center overflow-hidden`}
      >
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
        ) : leadingIcon ? (
          leadingIcon
        ) : (
          <View className="w-full h-full bg-violet-100 items-center justify-center">
            <Text className="font-sans-bold text-violet-600 text-base">
              {typeof title === 'string' ? title.charAt(0).toUpperCase() : 'A'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Render trailing action
  const renderTrailing = () => {
    if (trailing) return trailing;
    if (layout === 'vertical' || action === 'none') return null;

    switch (action) {
      case 'switch':
        return (
          <Switch
            value={actionChecked}
            onValueChange={onActionChange}
            disabled={disabled}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            checked={actionChecked}
            onChange={onActionChange}
            disabled={disabled}
          />
        );
      case 'radio':
        return (
          <Radio
            value={actionValue}
            selected={actionChecked}
            onSelect={() => onActionChange?.(!actionChecked)}
            disabled={disabled}
          />
        );
      case 'button':
        return (
          <Button
            size="sm"
            variant="default"
            disabled={disabled}
            onPress={onButtonPress}
          >
            {buttonTitle}
          </Button>
        );
      default:
        return null;
    }
  };

  const isInteractive = Boolean(onPress) && !disabled;
  const ContainerComponent = isInteractive ? Pressable : View;

  if (layout === 'vertical') {
    return (
      <ContainerComponent
        testID={testID}
        disabled={disabled}
        onPress={onPress}
        className={`flex-col items-center justify-center p-4 gap-2 bg-white rounded-2xl border border-grey-200 ${
          disabled ? 'opacity-60' : isInteractive ? 'active:bg-grey-50' : ''
        } ${className}`}
        style={style}
      >
        {renderLeading()}

        <View className="items-center w-full mt-1">
          {typeof title === 'string' ? (
            <Text
              className="font-sans-semibold text-base text-grey-950 text-center"
              style={titleStyle}
            >
              {title}
            </Text>
          ) : (
            title
          )}

          {description && (
            typeof description === 'string' ? (
              <Text
                className="font-sans text-sm text-grey-600 text-center mt-0.5"
                style={descriptionStyle}
              >
                {description}
              </Text>
            ) : (
              description
            )
          )}
        </View>

        {trailing && <View className="mt-2">{trailing}</View>}
      </ContainerComponent>
    );
  }

  // Horizontal layout (Figma node #89:8: 412x80px, padding 16px, gap 16px)
  return (
    <ContainerComponent
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      className={`flex-row items-center p-4 gap-4 bg-white rounded-2xl min-h-[80px] border border-grey-200 ${
        disabled ? 'opacity-60' : isInteractive ? 'active:bg-grey-50' : ''
      } ${className}`}
      style={style}
    >
      {renderLeading()}

      {/* Content Slot */}
      <View className="flex-1 justify-center gap-1">
        {typeof title === 'string' ? (
          <Text
            numberOfLines={1}
            className="font-sans-semibold text-base text-grey-950"
            style={titleStyle}
          >
            {title}
          </Text>
        ) : (
          title
        )}

        {description && (
          typeof description === 'string' ? (
            <Text
              numberOfLines={1}
              className="font-sans text-sm text-grey-600"
              style={descriptionStyle}
            >
              {description}
            </Text>
          ) : (
            description
          )
        )}
      </View>

      {/* Trailing Action Slot */}
      {renderTrailing()}
    </ContainerComponent>
  );
}

export default Item;
