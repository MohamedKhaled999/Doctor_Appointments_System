interface Reservation {
  day: number;
  time: string | null;
  id: number;
  isAvailable: boolean;
  date: Date;
}

export type { Reservation };
