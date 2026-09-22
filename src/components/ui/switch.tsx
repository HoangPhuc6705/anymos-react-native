import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Palette } from '@/constants/themes';

export interface SwitchProps {
  /** Controlled switch state */
  value?: boolean;
  /** Initial uncontrolled switch state */
  defaultValue?: boolean;
  /** Callback invoked when switch state changes */
  onValueChange?: (value: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Tailwind className */
  className?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
}

const TRACK_WIDTH = 61;
const TRACK_HEIGHT = 32;
const THUMB_SIZE = 24;
const OFFSET_OFF = 5;
const OFFSET_ON = 32;
const TRANSLATE_X_DISTANCE = OFFSET_ON - OFFSET_OFF; // 27px

export function Switch({
  value: controlledValue,
  defaultValue = false,
  onValueChange,
  disabled = false,
  className = '',
  style,
  accessibilityLabel = 'Toggle Switch',
  testID,
}: SwitchProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isChecked = isControlled ? controlledValue : internalValue;

  // Animation value: 0 (OFF) -> 1 (ON)
  const animatedValue = useRef(new Animated.Value(isChecked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isChecked ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isChecked]);

  const handlePress = (_e: GestureResponderEvent) => {
    if (disabled) return;

    const nextValue = !isChecked;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  // Interpolated thumb translation
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRANSLATE_X_DISTANCE],
  });

  // Interpolated track background color
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.grey[200], Palette.violet[500]], // #E4E4E7 -> #8E51FF per Figma
  });

  return (
    <Pressable
      testID={testID}
      accessibilityRole="switch"
      accessibilityState={{ checked: isChecked, disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={handlePress}
      className={`${disabled ? 'opacity-60' : 'active:opacity-90'} ${className}`}
      style={style}
    >
      <Animated.View
        style={[
          styles.track,
          { backgroundColor },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

export default Switch;

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: 100, // pill 100px per Figma node #36:6
    justifyContent: 'center',
    position: 'relative',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 9999,
    backgroundColor: Palette.white,
    position: 'absolute',
    left: OFFSET_OFF, // 5px offset per Figma node #36:12
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
});
