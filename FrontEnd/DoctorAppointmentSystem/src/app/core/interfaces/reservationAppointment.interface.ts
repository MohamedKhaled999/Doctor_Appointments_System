interface ReservationAppointment {
  id: number;
  patient: string;
  documentUrls: string | null; // URLs of uploaded documents, separated by '||'
  prescriptionUrl: string | null; // URL of the prescription document
}

export type { ReservationAppointment };
 