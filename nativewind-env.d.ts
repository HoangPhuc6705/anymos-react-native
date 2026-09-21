/// <reference types="nativewind/types" />

import 'react-native';

declare module 'react-native' {
  interface PressableProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
}

declare global {
  module '*.css' {}
}
