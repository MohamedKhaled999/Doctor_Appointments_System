import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, viewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/interfaces/doctor.interface';
import { Rating } from '../../../core/interfaces/rating.interface';
import { Schedule } from '../../../core/interfaces/Schedule.interface';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reservation } from '../../../core/interfaces/reservation.interface';
import { CalendarReservation } from '../../../core/interfaces/calendarReservation.interface';

declare var bootstrap: any;
declare var calendarJS: any;

@Component({
  selector: 'app-doctor-profile',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.css'
})
export class DoctorProfileComponent implements OnInit, AfterViewInit {
  doctor: Doctor | undefined;
  reviews: Rating[] | undefined;
  weekDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  scheduleForm: Schedule = {
    startTime: '',
    endTime: '',
    days: new Array(7).fill('0'),
    reservationQuota: 1
  }
  selectedTab: 'details' | 'reviews' | 'calendar' = 'details';
  reservationForm: FormGroup;
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
  /**
   *
  */
  constructor(private doctorService: DoctorService, private route: ActivatedRoute) {
    this.reservationForm = new FormGroup({
      id: new FormControl(''),
      date: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      maxAppointments: new FormControl('', [Validators.required, Validators.min(1)])
    });
  }
  ngAfterViewInit(): void {
    this.initMap();
    this.modalInstance = new bootstrap.Modal(document.getElementById('reservationModal') as HTMLElement);
    // this.initCalendar(this.doctor!.reservations);
  }
  setTab(arg0: string) {
    this.selectedTab = arg0 as 'details' | 'reviews' | 'calendar';
    if (arg0 === 'calendar') {
    }
  }
  ngOnInit(): void {
    // this.doctorService.getProfile(this.route.snapshot.params['id']).subscribe(profile => {
    //   this.doctor = profile;
    //   this.reviews = profile.ratings;
    // });
    this.doctor = {
      id: 1,
      name: 'John Doe',
      title: 'Cardiologist',
      gender: 'male',
      image: 'https://example.com/doctor.jpg',
      qualifications: 'MD, PhD',
      fees: 100,
      specialty: 'Cardiology',
      rating: 4.5,
      waitingTime: 30,
      governorate: 'Cairo',
      location: 'Cairo',
      phone: '0123456789',
      ratings: [
        {
          id: 1,
          patientName: 'John Doe',
          rate: 4,
          review: 'Great doctor!',
          date: '2025-10-01',
          docId: 1
        },
        {
          id: 2,
          patientName: 'Jane Doe',
          rate: 5,
          review: 'Excellent service!',
          date: '2025-10-02',
          docId: 1
        }
      ],
      reservations: [
        {
          day: 1,
          time: '10:00 AM - 11:00 AM',
          id: 1,
          isAvailable: true
        },
        {
          day: 1,
          time: '11:00 AM - 12:00 PM',
          id: 2,
          isAvailable: false
        },
        {
          day: 2,
          time: '10:00 AM - 11:00 AM',
          id: 3,
          isAvailable: true
        }
      ],
      latitude: 30.0444,
      longitude: 31.2357,
      schedule: {
        startTime: '08:00',
        endTime: '17:00',
        days: ['0', '1', '1', '1', '1', '1', '0'],
        reservationQuota: 10
      }
    }
    this.reviews = this.doctor.ratings;
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
    // this.doctorService.updateSchedule(this.doctor!.id, this.scheduleForm).subscribe(() => {
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
  initCalendar(reservations: Reservation[]): void {
    const script = document.createElement('script');
    script.src = '/calenderJS/dist/calendar.min.js';
    document.body.appendChild(script);
    script.onload = () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
      this.calendarInstance = new calendarJS(
        this.calendarContainer?.nativeElement,
        {
          initialDateTime: currentDate,
          minimumYear: currentYear,
          maximumYear: nextMonthDate.getFullYear(),
          manualEditingEnabled: false,
          views: {
            fullMonth: {
              enabled: true,
              isPinUpViewEnabled: false,
              showExtraTitleBarButtons: false,
              showPreviousNextMonthNames: false
            },
            fullDay: { enabled: false },
            fullWeek: { enabled: false },
            fullYear: { enabled: false },
            timeline: { enabled: false },
            allEvents: { enabled: false }
          },
          fullScreenModeEnabled: false,
          exportEventsEnabled: false,
          importEventsEnabled: false,
          configurationDialogEnabled: false,
          jumpToDateEnabled: false,
          dragAndDropForEventsEnabled: false,
          sideMenu: {
            showDays: false,
            showEventTypes: false,
            showGroups: false,
            showWorkingDays: false,
            showWeekendDays: false
          },
          events: {
            onPreviousMonth: (displayDate: Date) => {
              this.calendarInstance.setCurrentDisplayDate(
                new Date(currentYear, currentMonth, 1)
              );
            },
            onNextMonth: (displayDate: Date) => {
              this.calendarInstance.setCurrentDisplayDate(
                new Date(currentYear, currentMonth + 1, 1)
              );
            },
            onEventClick: (event: CalendarReservation) => {
              // this.reservationForm.controls['date'].setValue = event.from.toString();
              // this.reservationForm.controls['id'].setValue = event.ResID;
              // this.reservationForm.controls['startTime'].setValue = event.from
              //   .toTimeString()
              //   .slice(0, 5);

              // if (event.isAllDay) {
              //   this.calFormBTN.nativeElement.innerText = 'Add';
              //   this.formValues.startTime = '09:00';
              //   this.formValues.endTime = '17:00';
              //   this.deleteBTNDiv.nativeElement.classList.add('d-none');
              // } else {
              //   this.calFormBTN.nativeElement.innerText = 'Update';
              //   this.deleteBTNDiv.nativeElement.classList.remove('d-none');
              //   this.formValues.startTime = event.from
              //     .toTimeString()
              //     .slice(0, 5);
              //   this.formValues.endTime = event.to
              //     .toTimeString()
              //     .slice(0, 5);
              // }
              this.modalInstance.show();
            }
          }
        }
      );

    }
  }
  uploadPhoto(event: any): void {
    this.doctorService.uploadPhoto(this.doctor!.id, event.target.files[0]).subscribe();
  }
  addReservation(): void { }
  onDeleteReservation() {
  }
}
