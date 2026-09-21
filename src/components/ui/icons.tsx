import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Palette } from '@/constants/themes';

interface IconProps {
  size?: number;
  color?: string;
}

/** Solar Arrow Left Linear - Figma #7:723 */
export function ArrowLeftIcon({ size = 24, color = Palette.grey[900] }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 19.92L8.48 13.4C7.71 12.63 7.71 11.37 8.48 10.6L15 4.08"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Solar User Linear - Figma #7:441 */
export function UserIcon({ size = 20, color = Palette.grey[500] }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7" r="4.5" stroke={color} strokeWidth={1.5} />
      <Path
        d="M4.5 20C4.5 16.4101 7.85786 13.5 12 13.5C16.1421 13.5 19.5 16.4101 19.5 20"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Solar Lock Linear - Figma #7:446 */
export function LockIcon({ size = 20, color = Palette.grey[500] }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="3"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="15" r="1" fill={color} />
    </Svg>
  );
}

/** Solar Letter/Mail Linear - Figma #7:459 */
export function MailIcon({ size = 20, color = Palette.grey[500] }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M4 7L10.887 11.821C11.554 12.288 12.446 12.288 13.113 11.821L20 7"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Solar Eye Closed Bold - Figma #7:454 */
export function EyeClosedIcon({ size = 20, color = Palette.grey[500] }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10C3 10 6.5 15 12 15C17.5 15 21 10 21 10"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <Path d="M5.5 13.5L3.5 16" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M9.5 15L8.5 18" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M14.5 15L15.5 18" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M18.5 13.5L20.5 16" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
    </Svg>
  );
}

/** Solar Eye Linear (Open) */
export function EyeIcon({ size = 20, color = Palette.grey[500] }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
        stroke={color}
        strokeWidth={1.5}
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

/** Devicon Google - Figma #3:114 */
export function GoogleIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

/** Solar Lock Password Unlocked - Figma #15:981 */
export function KeyUnlockedIcon({ size = 56, color = Palette.violet[500] }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="10" width="16" height="11" rx="3" stroke={color} strokeWidth={1.5} />
      <Path
        d="M7 10V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="15.5" r="1.5" fill={color} />
    </Svg>
  );
}

/** Solar Verified Check Outline - Figma #15:976 */
export function ShieldCheckIcon({ size = 56, color = Palette.violet[500] }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L4 5V11C4 16.52 7.41 21.61 12 22.89C16.59 21.61 20 16.52 20 11V5L12 2Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11.5L11 13.5L15 9.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Anymos Logo Component */
export function AnymosLogo({ width = 72, height = 60 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 80 66" fill="none">
      <Path
        d="M40 4L74 62H6L40 4Z"
        stroke={Palette.violet[500]}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <Circle cx="40" cy="42" r="8" fill={Palette.violet[500]} />
    </Svg>
  );
}
