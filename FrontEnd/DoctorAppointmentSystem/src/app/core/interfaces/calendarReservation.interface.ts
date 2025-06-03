interface CalendarReservation {
  from: string;
  to: string;
  title: string;
  color: string;
  colorBorder: string;
  status: string;
  id: number;
  maxReservations: number;
  isAllDay: boolean;
}

export type { CalendarReservation };
