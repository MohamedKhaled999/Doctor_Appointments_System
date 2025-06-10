interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  eventType: number;
  timeStamp: string;
}

export type { Notification };
