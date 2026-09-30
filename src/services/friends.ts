export type FriendSearchMode = "friends" | "email";

export interface FriendSearchResult {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isOnline: boolean;
  statusText: string;
  statusColor: string;
  relationship: "friend" | "none" | "pending";
}

const SEARCH_RESULTS: FriendSearchResult[] = [
  {
    id: "1",
    name: "Hermione Granger",
    email: "hermione@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    isOnline: true,
    statusText: "Đang hoạt động",
    statusColor: "#8E51FF",
    relationship: "friend",
  },
  {
    id: "2",
    name: "Sofia Ramirez",
    email: "sofia@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    isOnline: true,
    statusText: "Đang hoạt động",
    statusColor: "#8E51FF",
    relationship: "friend",
  },
  {
    id: "11",
    name: "Olivia Martin",
    email: "olivia.martin@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1488427560561-9a70c97e8e4c?w=150",
    isOnline: false,
    statusText: "Chưa kết bạn",
    statusColor: "#71717A",
    relationship: "none",
  },
  {
    id: "12",
    name: "Noah Williams",
    email: "noah.williams@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    isOnline: true,
    statusText: "Chưa kết bạn",
    statusColor: "#71717A",
    relationship: "none",
  },
];

export async function searchFriendsByName(
  query: string,
): Promise<FriendSearchResult[]> {
  const normalizedQuery = query.trim().toLowerCase();
  return SEARCH_RESULTS.filter(
    (friend) =>
      friend.relationship === "friend" &&
      (!normalizedQuery || friend.name.toLowerCase().includes(normalizedQuery)),
  );
}

export async function searchUsersByEmail(
  query: string,
): Promise<FriendSearchResult[]> {
  const normalizedQuery = query.trim().toLowerCase();
  return SEARCH_RESULTS.filter(
    (friend) =>
      friend.relationship !== "friend" &&
      (!normalizedQuery ||
        friend.email.toLowerCase().includes(normalizedQuery)),
  );
}

export async function sendFriendRequest(_userId: string): Promise<void> {
  // Replace with apiRequest once the friend-request endpoint is available.
}
