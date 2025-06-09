import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/interfaces/doctor.interface';
import { Rating } from '../../../core/interfaces/rating.interface';
import { Schedule } from '../../../core/interfaces/Schedule.interface';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Reservation } from '../../../core/interfaces/reservation.interface';
import { CalendarReservation } from '../../../core/interfaces/calendarReservation.interface';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReservationDialogComponent } from '../../shared/reservation-dialog/reservation-dialog.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { AccountService } from '../../../core/services/account.service';
import Swal from 'sweetalert2';
import { GovernoratesService } from '../../../core/services/governorates.service';
import { NotificationsComponent } from "../../shared/notifications/notifications.component";

declare var bootstrap: any;
declare var calendarJS: any;

export enum CalendarView {
  Month = 'month',
  Week = 'week',
  Day = 'day'
}

@Component({
  selector: 'app-doctor-profile',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MatButtonToggleModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, DragDropModule, NotificationsComponent],
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.css'
})
export class DoctorProfileComponent implements OnInit {
  doctor: Doctor | undefined;
  governorates: string[] = [];
  myProfile = false;
  reviews: Rating[] | undefined;
  pagedReviews: Rating[] | undefined;
  currentPage = 1;
  pageSize = 5;
  pageCount = 0;
  weekDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  scheduleForm: Schedule = {
    startTime: '',
    endTime: '',
    days: new Array(7).fill('0'),
    reservationQuota: 1
  }
  selectedTab: 'details' | 'reviews' | 'calendar' = 'details';
  @ViewChild('mapContainer', { static: false }) mapContainer: ElementRef | undefined;
  @ViewChild('calendarContainer', { static: false }) calendarContainer: ElementRef | undefined;
  @ViewChild('calDate', { static: false })
  calDate!: ElementRef<HTMLInputElement>;

  @ViewChild('resID', { static: false })
  resID!: ElementRef<HTMLInputElement>;

  @ViewChild('startTime', { static: false })
  startTime!: ElementRef<HTMLInputElement>;

  @ViewChild('endTime', { static: false })
  endTime!: ElementRef<HTMLInputElement>;

  @ViewChild('maxRes', { static: false })
  maxRes!: ElementRef<HTMLInputElement>;

  @ViewChild('calFormBTN', { static: false })
  calFormBTN!: ElementRef<HTMLButtonElement>;

  @ViewChild('deleteBTNDiv', { static: false })
  deleteBTNDiv!: ElementRef<HTMLDivElement>;
  private calendarInstance: any;
  private modalInstance: any;
  viewDate: Date = new Date();
  selectedDate: Date | null = null;
  selectedStartTime: string | undefined;
  monthDays: Date[] = [];
  currentView: CalendarView = CalendarView.Month;
  timeSlots: string[] = [];
  weeks: Date[][] = [];
  public CalendarView = CalendarView;
  /**
   *
  */
  constructor(private doctorService: DoctorService, private route: ActivatedRoute, public dialog: MatDialog, private auth: AccountService, private governoratesService: GovernoratesService) {
    this.generateCalendarView(this.currentView, this.viewDate);
    this.generateTimeSlots();
    this.governorates = this.governoratesService.getGovernorates();
  }
  generateCalendarView(view: CalendarView, date: Date): void {
    switch (view) {
      case CalendarView.Month:
        this.generateMonthView(date);
        break;
      case CalendarView.Week:
        this.generateWeekView(date);
        break;
      case CalendarView.Day:
        this.generateDayView(date);
        break;
    }
  }
  generateMonthView(date: Date): void {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.weeks = [];
    this.monthDays = [];
    let week: Date[] = [];

    for (let day = start.getDay(); day > 0; day--) {
      const prevDate = new Date(start);
      prevDate.setDate(start.getDate() - day);
      week.push(prevDate);
      this.monthDays.push(prevDate);
    }

    for (let day = 1; day <= end.getDate(); day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      this.monthDays.push(currentDate);
      week.push(currentDate);
      if (week.length === 7) {
        this.weeks.push(week);
        week = [];
      }
    }

    for (let day = 1; this.monthDays.length % 7 !== 0; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      this.monthDays.push(nextDate);
    }

    for (let day = 1; week.length < 7; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      week.push(nextDate);
    }

    if (week.length > 0) {
      this.weeks.push(week);
    }
  }
  generateWeekView(date: Date) {
    const startOfWeek = this.startOfWeek(date);
    this.monthDays = [];

    for (let day = 0; day < 7; day++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + day);
      this.monthDays.push(weekDate);
    }
  }

  generateDayView(date: Date) {
    this.monthDays = [date];
  }
  generateTimeSlots() {
    for (let hour = 0; hour <= 24; hour++) {
      const time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      this.timeSlots.push(time);
    }
  }

  switchToView(view: CalendarView) {
    this.currentView = view;
    this.generateCalendarView(this.currentView, this.viewDate);
  }
  startOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(start.setDate(diff));
  }
  previous() {
    if (this.currentView === 'month') {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() - 1)
      );
      this.generateMonthView(this.viewDate);
    } else if (this.currentView === 'week') {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() - 7)
      );
      this.generateWeekView(this.viewDate);
    } else {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() - 1)
      );
      this.generateDayView(this.viewDate);
    }
  }

  next() {
    if (this.currentView === 'month') {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() + 1)
      );
      this.generateMonthView(this.viewDate);
    } else if (this.currentView === 'week') {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() + 7)
      );
      this.generateWeekView(this.viewDate);
    } else {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() + 1)
      );
      this.generateDayView(this.viewDate);
    }
  }
  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isSelected(date: Date): boolean {
    if (!this.selectedDate) {
      return false;
    }
    return (
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }
  selectDate(date?: Date, startTime?: string) {
    if (date) {
      this.selectedDate = date;
    } else {
      this.selectedDate = new Date();
    }
    this.selectedStartTime = startTime;
    this.openDialog();
  }
  openDialog(): void {
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes();
    const h = hour < 10 ? `0${hour}` : hour;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '400px',
      height: '400px',
      panelClass: 'dialog-container',
      data: {
        date: this.selectedDate,
        startTime: this.selectedStartTime,
        endTime: this.selectedStartTime
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          result.date.setDate(result.date.getDate() + 1)
          const reservation = {
            date: result.date,
            endTime: result.endTime,
            startTime: result.startTime,
            maxRes: result.maxAppointments,
            doctorId: this.doctor?.id,
          };
          this.doctorService.addReservation(reservation).subscribe({
            next: (res) => {
              Swal.fire({
                title: 'Success',
                text: 'Reservation added successfully',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.doctorService.getReservations(this.doctor!.id).subscribe(reservations => {
                reservations.forEach(reservation => {
                  reservation.date = new Date(reservation.startTime.split('T')[0]);
                  reservation.time = `${reservation.startTime.split('T')[1]} : ${reservation.endTime.split('T')[1]}`;
                });
                if (this.doctor) {
                  this.doctor.reservations = reservations;
                  this.generateCalendarView(this.currentView, this.viewDate);
                }
              });
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: 'There was an error adding the reservation. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
        }
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'There was an error processing your request. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.viewDate.getMonth() &&
      date.getFullYear() === this.viewDate.getFullYear()
    );
  }
  viewToday(): void {
    this.viewDate = new Date();
    this.generateCalendarView(this.currentView, this.viewDate);
  }
  setTab(arg0: string) {
    this.selectedTab = arg0 as 'details' | 'reviews' | 'calendar';
    if (arg0 === 'calendar') {
    }
  }
  ngOnInit(): void {
    this.doctorService.getProfile(this.route.snapshot.params['id']).subscribe(profile => {
      this.doctor = profile;
      this.doctor.governorate = this.governorates[parseInt(this.doctor.governorate) - 1];
      this.initMap();
      this.doctorService.getReservations(this.doctor.id).subscribe({
        next: (reservations) => {
          reservations.forEach(reservation => {
            reservation.date = new Date(reservation.startTime.split('T')[0]);
            reservation.time = `${reservation.startTime.split('T')[1]} : ${reservation.endTime.split('T')[1]}`;
          });
          if (this.doctor) {
            this.doctor.reservations = reservations;
          }
        }
        ,
        error: (_) => { }
      });
      // this.reviews = profile.ratings;
      // this.pageCount = Math.ceil(this.reviews!.length / this.pageSize);
      // this.setPage(1);
    });
    // this.doctor = {
    //   id: 1,
    //   name: 'John Doe',
    //   title: 'Cardiologist',
    //   gender: 'male',
    //   image: 'https://example.com/doctor.jpg',
    //   qualifications: 'MD, PhD',
    //   fees: 100,
    //   specialty: 'Cardiology',
    //   rating: 4.5,
    //   waitingTime: 30,
    //   governorate: 'Cairo',
    //   location: 'Cairo',
    //   phone: '0123456789',
    //   ratings: [
    //     {
    //       id: 1,
    //       patientName: 'John Doe',
    //       rate: 4,
    //       review: 'Great doctor!',
    //       date: '2025-10-01',
    //       docId: 1
    //     },
    //     {
    //       id: 2,
    //       patientName: 'Jane Doe',
    //       rate: 5,
    //       review: 'Excellent service!',
    //       date: '2025-10-02',
    //       docId: 1
    //     },
    //     {
    //       id: 3,
    //       patientName: 'Alice Smith',
    //       rate: 3,
    //       review: 'Average experience.',
    //       date: '2025-10-03',
    //       docId: 1
    //     },
    //     {
    //       id: 4,
    //       patientName: 'Bob Johnson',
    //       rate: 2,
    //       review: 'Not satisfied with the service.',
    //       date: '2025-10-04',
    //       docId: 1
    //     },
    //     {
    //       id: 5,
    //       patientName: 'Charlie Brown',
    //       rate: 4,
    //       review: 'Good doctor, but waiting time was long.',
    //       date: '2025-10-05',
    //       docId: 1
    //     },
    //     {
    //       id: 6,
    //       patientName: 'David Wilson',
    //       rate: 5,
    //       review: 'Highly recommend!',
    //       date: '2025-10-06',
    //       docId: 1
    //     }
    //   ],
    //   reservations: [
    //     {
    //       day: 1,
    //       time: '10:00 AM - 11:00 AM',
    //       id: 1,
    //       isAvailable: true,
    //       date: new Date('2025-6-01')
    //     },
    //     {
    //       day: 1,
    //       time: '11:00 AM - 12:00 PM',
    //       id: 2,
    //       isAvailable: false,
    //       date: new Date('2025-6-02')
    //     },
    //     {
    //       day: 2,
    //       time: '10:00 AM - 11:00 AM',
    //       id: 3,
    //       isAvailable: true,
    //       date: new Date('2025-6-03')
    //     }
    //   ],
    //   latitude: 30.0444,
    //   longitude: 31.2357,
    //   schedule: {
    //     startTime: '08:00',
    //     endTime: '17:00',
    //     days: ['0', '1', '1', '1', '1', '1', '0'],
    //     reservationQuota: 10
    //   }
    // }
    // this.reviews = this.doctor.ratings;
    //   this.pageCount = Math.ceil(this.reviews!.length / this.pageSize);
    //   this.setPage(1);
  }
  setPage(arg0: number) {
    if (arg0 < 1 || arg0 > this.pageCount) return;
    this.currentPage = arg0;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedReviews = this.reviews!.slice(startIndex, startIndex + this.pageSize);
  }
  floorRate(rate: number): number {
    return Math.floor(rate);
  }
  ceilRate(rate: number): number {
    return Math.ceil(rate);
  }
  getNextDate(day: number): string {
    const today = new Date().getDay();
    const todayIdxCustom = (today + 6) % 7;
    let diff = day - todayIdxCustom;
    if (diff < 0) {
      diff += 7;
    }
    if (diff === 0) {
      return 'Today';
    }
    if (diff === 1) {
      return 'Tomorrow';
    }
    const d = new Date();
    d.setDate(d.getDate() + diff);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
  toggleDay(day: number): void {
    this.scheduleForm.days[day] = this.scheduleForm.days[day] === '1' ? '0' : '1';
  }
  saveSchedule(): void {
    // this.doctorService.updateSchedule(this.scheduleForm).subscribe(() => {
    //   Swal.fire({
    //     title: 'Success',
    //     text: 'Schedule updated successfully',
    //     icon: 'success',
    //     confirmButtonText: 'OK'
    //   });
    // });
    console.log('Schedule saved:', this.scheduleForm);
  }
  initMap(): void {
    import('leaflet').then(L => {
      if (!this.mapContainer) return;
      if (!this.doctor) return;
      const { latitude, longitude } = this.doctor;
      const map = new L.Map(this.mapContainer.nativeElement).setView([latitude, longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
      const marker = new L.Marker([latitude, longitude]).addTo(map);
      marker.bindPopup(`<b>${this.doctor!.name}</b><br>${this.doctor!.location}`).openPopup();
    });
  }
  uploadPhoto(event: any): void {
    this.doctorService.uploadPhoto(event.target.files[0]).subscribe();
  }
  editReservation(reservation: Reservation, event: any): void {
    event.preventDefault();
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '400px',
      panelClass: 'dialog-container',
      data: {
        id: reservation.id,
        date: reservation.date,
        startTime: reservation.time?.split(' : ')[0],
        endTime: reservation.time?.split(' : ')[1],
        maxRes: reservation.maxAppoinments
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result && result?.action !== 'delete') {
          const newReservation = {
            id: result.id,
            date: result.date,
            startTime: result.startTime,
            endTime: result.endTime,
            maxRes: result.maxAppointments,
            doctorId: this.doctor?.id
          };
          this.doctorService.editReservation(newReservation).subscribe({
            next: () => {
              Swal.fire({
                title: 'Success',
                text: 'Reservation added successfully',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.doctor?.reservations.forEach(res => {
                if (res.id === newReservation.id) {
                  res.time = `${newReservation.startTime} : ${newReservation.endTime}`;
                }
              });
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: 'There was an error editing the reservation. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
        } else if (result?.action === 'delete') {
          this.doctorService.deleteReservation(result.id).subscribe({
            next: () => {
              Swal.fire({
                title: 'Success',
                text: 'Reservation deleted successfully',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.doctor!.reservations = this.doctor!.reservations?.filter(res => res.id !== result.id);
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: `You can't delete this reservation because it has less than 48 hours left.`,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
        }
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'There was an error editing the reservation. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  onDeleteReservation() {
  }
  drop(event: CdkDragDrop<Reservation[] | undefined>, date: Date, slot?: string): void {
    const reservation = event.item.data as Reservation;
    reservation.date = date;
    if (slot) {
      reservation.time = slot;
    }
    reservation.date = date;
    const updatedReservation = {
      id: reservation.id,
      date: reservation.date,
      startTime: reservation.time?.split(' : ')[0],
      endTime: reservation.time?.split(' : ')[1],
      // maxRes: reservation.maxAppoinments,
      doctorId: this.doctor?.id
    };
    // this.doctorService.editReservation(updatedReservation).subscribe(() => {
    //   Swal.fire({
    //     title: 'Success',
    //     text: 'Reservation updated successfully',
    //     icon: 'success',
    //     confirmButtonText: 'OK'
    //   });
    //   if (this.doctor) {
    //     this.doctor.reservations = this.doctor.reservations?.map(res => res.id === reservation.id ? { ...res, date: reservation.date, time: reservation.time } : res);
    //   }
    // });
  }
  getReservationsForDateTime(date: Date, time: string): Reservation[] {
    if (!this.doctor || !this.doctor.reservations) return [];
    return this.doctor.reservations.filter(reservation =>
      this.isSameDate(reservation.date, date) && reservation.time?.startsWith(time)
    );
  }
}
