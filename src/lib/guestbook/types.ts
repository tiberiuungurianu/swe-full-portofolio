export type GuestbookStatus = "pending" | "approved" | "rejected";

export type GuestbookMessage = {
  id: string;
  name: string;
  message: string;
  status: GuestbookStatus;
  createdAt: string;
  moderatedAt?: string;
};

export type GuestbookStoreFile = {
  version: 1;
  messages: GuestbookMessage[];
};
