export interface Kudos {
  id: string;
  message: string;
  points: number;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  isFeatured: boolean;
}

export interface KudosListResponse {
  items: Kudos[];
  totalCount: number;
  page: number;
  pageSize: number;
}
