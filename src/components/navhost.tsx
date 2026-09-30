import { ChatRoundIcon as ChatRoundBold } from "@solar-icons/react-native/bold/chat-round";
import { InboxUnreadIcon as InboxBold } from "@solar-icons/react-native/bold/inbox-unread";
import { UsersGroupTwoRoundedIcon as UsersGroupBold } from "@solar-icons/react-native/bold/users-group-two-rounded";
import { ChatRoundIcon as ChatRoundLinear } from "@solar-icons/react-native/linear/chat-round";
import { HamburgerMenuIcon } from "@solar-icons/react-native/linear/hamburger-menu";
import { InboxUnreadIcon as InboxLinear } from "@solar-icons/react-native/linear/inbox-unread";
import { UsersGroupTwoRoundedIcon as UsersGroupLinear } from "@solar-icons/react-native/linear/users-group-two-rounded";
import React from "react";
import { Pressable, View, type ViewProps } from "react-native";
import { cn } from "./ui/input";

export type NavTabKey = "chat" | "groups" | "inbox" | "menu";

export interface NavhostProps extends ViewProps {
  activeTab?: NavTabKey;
  onTabChange?: (tab: NavTabKey) => void;
  className?: string;
}

/**
 * Navhost Component (Figma node 30:83 / Bottom Navigation)
 * Thanh điều hướng dưới đáy gồm 4 tab: Chat, Groups, Inbox, Menu sử dụng chuẩn icon Solar
 */
export function Navhost({
  activeTab = "chat",
  onTabChange,
  className,
  style,
  ...props
}: NavhostProps) {
  const activeColor = "#8E51FF"; // primary
  const inactiveColor = "#71717A"; // mute-foreground

  const tabs: {
    key: NavTabKey;
    label: string;
    renderIcon: (active: boolean) => React.ReactNode;
  }[] = [
    {
      key: "chat",
      label: "Tin nhắn",
      renderIcon: (active) =>
        active ? (
          <ChatRoundBold size={24} color={activeColor} />
        ) : (
          <ChatRoundLinear size={24} color={inactiveColor} />
        ),
    },
    {
      key: "groups",
      label: "Nhóm",
      renderIcon: (active) =>
        active ? (
          <UsersGroupBold size={24} color={activeColor} />
        ) : (
          <UsersGroupLinear size={24} color={inactiveColor} />
        ),
    },
    {
      key: "inbox",
      label: "Hộp thư",
      renderIcon: (active) =>
        active ? (
          <InboxBold size={24} color={activeColor} />
        ) : (
          <InboxLinear size={24} color={inactiveColor} />
        ),
    },
    {
      key: "menu",
      label: "Cài đặt",
      renderIcon: (active) => (
        <HamburgerMenuIcon
          size={24}
          color={active ? activeColor : inactiveColor}
        />
      ),
    },
  ];

  return (
    <View
      className={cn(
        "w-full flex-row items-center h-14 bg-background border-t border-border/40 px-2",
        className,
      )}
      style={style}
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onTabChange?.(tab.key)}
            className="flex-1 h-full items-center justify-center relative active:opacity-70"
          >
            {tab.renderIcon(isActive)}
          </Pressable>
        );
      })}
    </View>
  );
}

export default Navhost;
