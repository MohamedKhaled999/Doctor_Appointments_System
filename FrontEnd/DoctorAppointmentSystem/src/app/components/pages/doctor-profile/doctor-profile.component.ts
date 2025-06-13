import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, signal, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/interfaces/doctor.interface';
import { Rating } from '../../../core/interfaces/rating.interface';
import { Schedule } from '../../../core/interfaces/Schedule.interface';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
// import * as L from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { Icon, icon, latLng, marker, tileLayer } from 'leaflet';
import { DataManagementService } from '../../../core/services/data-management.service';
import { ReservationCardsContainerComponent } from "../../shared/reservation-cards-container/reservation-cards-container.component";
import { reservation } from '../../../core/interfaces/reservation';

declare var bootstrap: any;
declare var calendarJS: any;

export enum CalendarView {
  Month = 'month',
  Week = 'week',
  Day = 'day'
}
interface doctorImage {
  image: string;
  check: number;
}

@Component({
  selector: 'app-doctor-profile',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MatButtonToggleModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, DragDropModule, LeafletModule, ReservationCardsContainerComponent],
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
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  scheduleForm: Schedule = {
    startTime: '',
    endTime: '',
    days: new Array(7).fill('0'),
    reservationQuota: 1
  }
  selectedTab: 'details' | 'reviews' | 'calendar' = 'details';
  DoctorImage = signal<doctorImage>({ image: "", check: -1 })
  isMapInitialized = false;
  reservationCards: reservation[] = [];

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
  load = true;
  /**
   *
  */
  constructor(private doctorService: DoctorService, private route: ActivatedRoute, public dialog: MatDialog, private auth: AccountService, private governoratesService: GovernoratesService, @Inject(PLATFORM_ID) private platformId: Object, public dataService: DataManagementService) {
    this.generateCalendarView(this.currentView, this.viewDate);
    // this.generateTimeSlots();
    this.governorates = this.governoratesService.getGovernorates();
    this.myProfile = this.route.snapshot.params['id'] === undefined;
  }
  generateCalendarView(view: CalendarView, date: Date): void {
    switch (view) {
      case CalendarView.Month:
        this.generateMonthView(date);
        break;
      // case CalendarView.Week:
      //   this.generateWeekView(date);
      //   break;
      // case CalendarView.Day:
      //   this.generateDayView(date);
      //   break;
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
  // generateWeekView(date: Date) {
  //   const startOfWeek = this.startOfWeek(date);
  //   this.monthDays = [];


  //   for (let day = 0; day < 7; day++) {
  //     const weekDate = new Date(startOfWeek);
  //     weekDate.setDate(startOfWeek.getDate() + day);
  //     this.monthDays.push(weekDate);
  //   }
  // }

  // generateDayView(date: Date) {
  //   this.monthDays = [date];
  // }
  // generateTimeSlots() {
  //   for (let hour = 0; hour <= 24; hour++) {
  //     const time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
  //     this.timeSlots.push(time);
  //   }
  // }

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
      if (this.viewDate.getMonth() === new Date().getMonth() - 1 && this.viewDate.getFullYear() === new Date().getFullYear() || this.viewDate.getMonth() === 11 && this.viewDate.getFullYear() === new Date().getFullYear() - 1) {
        Swal.fire({
          title: 'Error!',
          text: 'You cannot go back more than one month from the current month.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() - 1)
      );
      this.generateMonthView(this.viewDate);
    }
    // else if (this.currentView === 'week') {
    //   this.viewDate = new Date(
    //     this.viewDate.setDate(this.viewDate.getDate() - 7)
    //   );
    //   this.generateWeekView(this.viewDate);
    // } else {
    //   this.viewDate = new Date(
    //     this.viewDate.setDate(this.viewDate.getDate() - 1)
    //   );
    //   this.generateDayView(this.viewDate);
    // }
  }

  next() {
    if (this.currentView === 'month') {
      if (
        this.viewDate.getMonth() === new Date().getMonth() + 1 && this.viewDate.getFullYear() === new Date().getFullYear() || this.viewDate.getMonth() === 0 && this.viewDate.getFullYear() === new Date().getFullYear() + 1) {
        Swal.fire({
          title: 'Error!',
          text: 'You cannot go forward more than one month from the current month.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;

      }
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() + 1)
      );
      this.generateMonthView(this.viewDate);
    }
    // else if (this.currentView === 'week') {
    //   this.viewDate = new Date(
    //     this.viewDate.setDate(this.viewDate.getDate() + 7)
    //   );
    //   this.generateWeekView(this.viewDate);
    // } else {
    //   this.viewDate = new Date(
    //     this.viewDate.setDate(this.viewDate.getDate() + 1)
    //   );
    //   this.generateDayView(this.viewDate);
    // }
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
      height: 'auto',
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
                  reservation.maxAppoinments = reservation.maxReservation;
                });
                if (this.doctor) {
                  this.doctor.reservations = reservations;
                  this.doctor.reservations = this.sortReservationsByTime(this.doctor.reservations!);
                }
              });
            },
            error: (error) => {
              let err = '';
              if (error.error?.ErrorMessage) { err += error.error.ErrorMessage }
              if (error.error?.Errors && error.error.Errors.length > 0) { err += `: ${error.error.Errors[0]}, ` }
              Swal.fire({
                title: 'Error',
                text: `There was an error adding the reservation: ${err + 'Please try again later.'}`,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
        }
      },
      error: (error) => {
        let err = '';
        if (error.error?.ErrorMessage) { err += error.error.ErrorMessage }
        if (error.error?.Errors && error.error.Errors.length > 0) { err += `: ${error.error.Errors[0]}, ` }
        Swal.fire({
          title: 'Error',
          text: `There was an error processing your request: ${err + 'Please try again later.'}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
    this.generateCalendarView(this.currentView, this.viewDate);
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
      this.DoctorImage.set({ image: profile.image, check: -1 });
      this.doctor.governorate = this.governorates[parseInt(this.doctor.governorate) - 1];
      this.initMap();
      this.doctorService.getReservations(this.doctor.id).subscribe({
        next: (reservations) => {
          reservations.forEach(reservation => {
            reservation.date = new Date(reservation.startTime.split('T')[0]);
            reservation.time = `${reservation.startTime.split('T')[1]} : ${reservation.endTime.split('T')[1]}`;
            reservation.maxAppoinments = reservation.maxReservation;
          });
          if (this.doctor) {
            reservations = this.sortReservationsByTime(reservations);
            this.reservationCards = reservations.filter(res => new Date(res.startTime.split('T')[0]) >= new Date()).map(res => ({
              DoctorId: this.doctor!.id,
              ResId: res.id,
              Day: res.day,
              StartTime: res.startTime,
              EndTime: res.endTime,
              IsAvailable: res.isAvailable,
            }));
            this.doctor.reservations = reservations;
          }
        }
        ,
        error: (_) => { }
      });
      this.doctorService.getReviews(this.doctor.id).subscribe({
        next: (reviews) => {
          this.doctor!.ratings = reviews;
          this.reviews = reviews;
          this.pageCount = Math.ceil(this.reviews!.length / this.pageSize);
          this.setPage(1);
        },
        error: (_) => {
          console.error('Error fetching reviews');
        }
      });
    });
    // this.doctor = {
    //   id: 1,
    //   name: 'John Doe',
    //   title: 'Cardiologist',
    //   gender: 'male',
    //   image: 'https://example.com/doctor.jpg',
    //   about: 'MD, PhD',
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
    // import('leaflet').then(l => {
    //   const L = l.default || l;
    //   if (!this.mapContainer) return;
    //   if (!this.doctor) return;
    //   const { latitude, longitude } = this.doctor;
    if (isPlatformBrowser(this.platformId)) {
      //   const map = new L.Map(this.mapContainer.nativeElement).setView([latitude, longitude], 13);
      //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
      //   const marker = new L.Marker([latitude, longitude]).addTo(map);
      //   marker.bindPopup(`<b>${this.doctor!.name}</b><br>${this.doctor!.location}`).openPopup();
      this.options.center = latLng(this.doctor!.latitude, this.doctor!.longitude);
      let layer = marker([this.doctor!.latitude, this.doctor!.longitude], {
        title: this.doctor!.name,
        alt: this.doctor!.name,
        draggable: false,
        icon: icon({
          className: 'leaflet-marker-icon',
          ...Icon.Default.prototype.options,
          iconUrl: 'assets/marker-icon.png', // 'https://cdn-icons-png.flaticon.com/512/149/149061.png',
          iconRetinaUrl: 'assets/marker-icon-2x.png',
          shadowUrl: 'assets/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      });
      this.options.layers.push(layer);
      this.isMapInitialized = true;
      // });
    }
  }
  options: any = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        detectRetina: true
      })
    ],
    zoom: 13,
    center: latLng(30.0444, 31.2357)
  }
  uploadPhoto(event: any): void {
    if (event.target.files[0].size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/jpg'].includes(event.target.files[0].type)) {
      Swal.fire({
        title: 'Error',
        text: 'File size must be less than 5MB and type must be JPEG or PNG.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    const oldpath = this.doctor?.image;
    let count = 0;
    this.doctorService.uploadPhoto(event.target.files[0]).subscribe({
      next: () => {
        this.getDoctorProfile();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  getDoctorProfile(): void {
    this.doctorService.getProfile(this.route.snapshot.params['id']).subscribe({
      next: (profile) => {
        this.doctor = profile;
        this.DoctorImage.set({ image: profile.image, check: this.DoctorImage().check * -1 })
        console.log(this.DoctorImage())
        console.log(this.doctor);

      },
      error: (error) => {
        console.error(error);
      }
    });
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
            resID: result.id,
            date: result.date,
            startTime: result.startTime.split(':').length < 3 ? result.startTime + ':00' : result.startTime,
            endTime: result.endTime.split(':').length < 3 ? result.endTime + ':00' : result.endTime,
            maxRes: result.maxAppointments,
            doctorID: this.doctor?.id
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
                if (res.id === newReservation.resID) {
                  res.time = `${newReservation.startTime} : ${newReservation.endTime}`;
                  res.maxAppoinments = newReservation.maxRes;
                }
              });
            },
            error: (error) => {
              let err = '';
              if (error.error?.ErrorMessage) { err += error.error.ErrorMessage }
              if (error.error?.Errors && error.error.Errors.length > 0) { err += `: ${error.error.Errors[0]}, ` }
              Swal.fire({
                title: 'Error',
                text: `There was an error updating the reservation: ${err + 'Please try again later.'}`,
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
              this.doctor!.reservations = this.sortReservationsByTime(this.doctor!.reservations!);
              // this.generateCalendarView(this.currentView, this.viewDate);
            },
            error: (error) => {
              let err = '';
              if (error.error?.ErrorMessage) { err += error.error.ErrorMessage }
              if (error.error?.Errors && error.error.Errors.length > 0) { err += `: ${error.error.Errors[0]}, ` }
              Swal.fire({
                title: 'Error',
                text: `There was an error deleting the reservation: ${err + 'Please try again later.'}`,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
        }
      },
      error: (error) => {
        let err = '';
        if (error.error?.ErrorMessage) { err += error.error.ErrorMessage }
        if (error.error?.Errors && error.error.Errors.length > 0) { err += `: ${error.error.Errors[0]}, ` }
        Swal.fire({
          title: 'Error',
          text: `There was an error processing your request: ${err + 'Please try again later.'}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
    this.generateCalendarView(this.currentView, this.viewDate);
  }
  onDeleteReservation() {
  }
  drop(event: CdkDragDrop<Reservation[] | undefined>, date: Date, slot?: string): void {
    if (this.doctor?.reservations.some(res => res.date.getDate() === date.getDate())) {
      console.log(date.getDate(), this.doctor?.reservations);

      this.load = false;
      Swal.fire({
        title: 'Error',
        text: 'You can only have one reservation per day',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.generateCalendarView(this.currentView, this.viewDate);
      this.load = true;
    }
    else if (date < new Date()) {
      this.load = false;
      Swal.fire({
        title: 'Error',
        text: 'You cannot book a reservation in the past',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.generateCalendarView(this.currentView, this.viewDate);
      this.load = true;
    }
    else {
      const reservation = event.item.data as Reservation;
      const updatedReservation = {
        resID: reservation.id,
        date: date,
        startTime: slot ? slot?.split(' : ')[0] : reservation.time?.split(' : ')[0],
        endTime: slot ? slot?.split(' : ')[1] : reservation.time?.split(' : ')[1],
        maxRes: reservation.maxAppoinments,
        doctorId: this.doctor?.id
      };
      updatedReservation.date.setDate(updatedReservation.date.getDate() + 1);
      this.doctorService.editReservation(updatedReservation).subscribe({
        next: () => {
          Swal.fire({
            title: 'Success',
            text: 'Reservation updated successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          if (this.doctor) {
            updatedReservation.date.setDate(updatedReservation.date.getDate() - 1);
            this.doctor.reservations = this.doctor.reservations?.map(res => res.id === reservation.id ? { ...res, date: updatedReservation.date, time: reservation.time } : res);
            this.doctor.reservations = this.sortReservationsByTime(this.doctor.reservations!);
          }
          this.generateCalendarView(this.currentView, this.viewDate);
          this.load = true;
        }
        ,
        error: (error) => {
          this.load = false;
          let err = '';
          if (error.error?.ErrorMessage) { err += error.error.ErrorMessage }
          if (error.error?.Errors && error.error.Errors.length > 0) { err += `: ${error.error.Errors[0]}, ` }
          this.generateCalendarView(this.currentView, this.viewDate);
          this.load = true;
          Swal.fire({
            title: 'Error',
            text: `There was an errror updating the reservation: ${err + 'Please try again later.'}`,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }
  getReservationsForDateTime(date: Date, time: string): Reservation[] {
    if (!this.doctor || !this.doctor.reservations) return [];
    const reservations = this.doctor.reservations.filter(reservation =>
      this.isSameDate(reservation.date, date) && reservation.time?.startsWith(time)
    );
    return reservations;
  }
  sortReservationsByTime(reservations: any[]): any[] {
    return reservations.sort((a, b) => {
      if (a.date > b.date) return 1;
      if (a.date < b.date) return -1;
      const timeA = a.time?.split(' : ')[0] || '';
      const timeB = b.time?.split(' : ')[0] || '';
      return timeA.localeCompare(timeB);
    });
  }
}
