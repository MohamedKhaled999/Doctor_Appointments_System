import { OverviewComponent } from "../../components/pages/Dashboard/overview/overview.component";

export interface DashboardOverview {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  monthlyRevenue: number;
  growthRate: number;
  averageRating: number;
}

export interface MonthlyStats {
  month: string;
  appointments: number;
  revenue: number;
  patients: number;
}


export interface SpecialtyDistribution {
  name: string;
  value: number;
  color: string;
}

export interface AppointmentStatus {
  status: string;
  count: number;
  color: string;
}

export interface TopDoctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  appointments: number;
  revenue: number;
}

export interface RecentAppointment {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
}

export interface UnApprovedDoctors {
  id : number;
  name : string;
  specialty : string;
  rating : number;
  appointments : number;
  revenue : number;
}
export interface DashboardData {
  overview: DashboardOverview;
  monthlyStats: MonthlyStats[];
  specialtyDistribution: SpecialtyDistribution[];
  appointmentStatus: AppointmentStatus[];
  topDoctors: TopDoctor[];
  recentAppointments: RecentAppointment[];
  unApprovedDoctors: UnApprovedDoctors[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
}


// DashboardOverview
// MonthlyStats []
// SpecialtyDistribution []
// AppointmentStatus []
// TopDoctor []
// unApprovedDoctors []
// RecentAppointment []
