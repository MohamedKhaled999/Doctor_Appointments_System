interface Reservation {
  day: number;
  time: string | null;
  id: number;
  isAvailable: boolean;
}

export type { Reservation };
