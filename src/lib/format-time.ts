// src/lib/format-time.ts

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAY_MS = 24 * 60 * 60 * 1000;

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Định dạng thời gian cho danh sách chat:
 * hôm nay -> "20:42", hôm qua -> "Hôm qua", trong tuần -> "T4",
 * cũ hơn -> "27/09" (khác năm thì "27/09/2025").
 */
export function formatChatTime(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return '';

  // Hermes có thể không parse được phần giây thập phân dài hơn 3 chữ số
  const d = new Date(iso.replace(/(\.\d{3})\d+/, '$1'));
  if (Number.isNaN(d.getTime())) return '';

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfThatDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfToday - startOfThatDay) / DAY_MS);

  if (diffDays <= 0) return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return WEEKDAYS[d.getDay()];

  const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  return d.getFullYear() === now.getFullYear() ? date : `${date}/${d.getFullYear()}`;
}

/**
 * Thời gian tương đối cho thông báo:
 * "Vừa xong", "5 phút trước", "3 giờ trước", "2 ngày trước",
 * từ 7 ngày trở lên -> "27/09" (khác năm thì "27/09/2025").
 */
export function formatRelativeTime(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return '';

  const d = new Date(iso.replace(/(\.\d{3})\d+/, '$1'));
  if (Number.isNaN(d.getTime())) return '';

  const minutes = Math.floor((now.getTime() - d.getTime()) / 60_000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;

  const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  return d.getFullYear() === now.getFullYear() ? date : `${date}/${d.getFullYear()}`;
}