import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DoctorService } from '../../../core/services/doctor.service';
import { GovernoratesService } from '../../../core/services/governorates.service';
import { DoctorEdit } from '../../../core/interfaces/doctorEdit.interface';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { Icon, icon, latLng, marker, tileLayer } from 'leaflet';

@Component({
  selector: 'app-doctor-edit',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, LeafletModule],
  templateUrl: './doctor-edit.component.html',
  styleUrl: './doctor-edit.component.css'
})
export class DoctorEditComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContanier!: ElementRef;
  doctorForm: FormGroup;
  doctor: DoctorEdit | undefined;
  governorates: string[];
  map: any;
  marker: any;
  isMapInitialized = false;
  /**
   *
   */
  constructor(private fb: FormBuilder,
    private doctorService: DoctorService,
    private governoratesService: GovernoratesService,
    private route: ActivatedRoute,
    private router: Router,
  @Inject(PLATFORM_ID) private platformId: Object) {
    this.doctorForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      gender: [{ value: '', disabled: true }],
      birthDate: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      governorate: ['', [Validators.required]],
      address: ['', [Validators.required]],
      lat: ['', []],
      lng: ['', []],
      specialty: [{ value: '', disabled: true }],
      fees: ['', [Validators.required, Validators.min(0)]],
      waitingTime: ['', [Validators.required, Validators.min(0)]],
      about: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
    this.governorates = this.governoratesService.getGovernorates();
  }
  ngOnInit(): void {
    this.doctorService.getProfile().subscribe(profile => {
      this.doctor = {
        id: profile.id,
        firstName: profile.name.split(' ')[0],
        lastName: profile.name.split(' ')[1],
        gender: profile.gender ? 'male' : 'female',
        imageUrl: profile.image,
        about: profile.about,
        fees: profile.fees,
        specialty: profile.speciality ? profile.speciality : profile.specialty,
        waitingTime: profile.waitingTime,
        governorate: profile.governorate,
        address: profile.location,
        phoneNumber: profile.phone,
        email: profile.email!,
        lat: profile.latitude,
        lng: profile.longitude,
        birthDate: profile.birthDate ? new Date(profile.birthDate) : new Date(),
        image: null
      };
      this.doctorForm.patchValue({
        id: this.doctor.id,
        firstName: this.doctor.firstName,
        lastName: this.doctor.lastName,
        specialty: this.doctor.specialty,
        fees: this.doctor.fees,
        waitingTime: this.doctor.waitingTime,
        about: this.doctor.about,
        governorate: this.governorates[parseInt(this.doctor.governorate) - 1],
        address: this.doctor.address,
        lat: this.doctor.lat,
        lng: this.doctor.lng,
        phoneNumber: this.doctor.phoneNumber,
        gender: this.doctor.gender,
        birthDate: this.formatDate(this.doctor.birthDate),
        email: this.doctor.email
      });
    });
    // this.doctor = {
    //     firstName: 'John Doe',
    //     lastName: 'Smith',
    //     gender: 'male',
    //     imageUrl: 'https://example.com/doctor.jpg',
    //     about: 'MD, PhD',
    //     fees: 100,
    //     specialty: 'Cardiology',
    //     waitingTime: 30,
    //     governorate: 'Cairo',
    //     address: '123 Main St, Cairo',
    //     birthDate: new Date('1980-01-01'),
    //     phoneNumber: '0123456789',
    //     email: 'I7eE5@example.com',
    //     lat: 30.0444,
    //     lng: 31.2357,
    //     image: null
    //   }
  }
  formatDate(birthDate: Date): any {
    const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
    const day = birthDate.getDate().toString().padStart(2, '0');
    return `${birthDate.getFullYear()}-${month}-${day}`;
  }
  initMap(): void {
    // if (this.isMapInitialized) return;
    // import('leaflet').then(L => {
    //   if (!this.mapContanier) return;
    //   if (!this.doctor) return;
    //   const { lat, lng } = this.doctor;
    //   const map = new L.Map(this.mapContanier.nativeElement).setView([lat, lng], 13);
    //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
    //   const marker = new L.Marker([lat, lng], { draggable: true }).addTo(map);
    //   marker.bindPopup(`<b>${this.doctor.firstName} ${this.doctor.lastName}</b><br>${this.governorates[parseInt(this.doctor.governorate) - 1]}`).openPopup();
    //   marker.on('dragend', (event: any) => {
    //     const position = event.target.getLatLng();
    //     this.doctorForm.patchValue({
    //       lat: position.lat,
    //       lng: position.lng
    //     });
    //   });
    //   map.on('click', (event: any) => {
    //     const position = event.latlng;
    //     marker.setLatLng(position);
    //     this.doctorForm.patchValue({
    //       lat: position.lat,
    //       lng: position.lng
    //     });
    //   });
    //   this.map = map;
    //   this.marker = marker;
    //   this.isMapInitialized = true;
    // });
    if(isPlatformBrowser(this.platformId)){
      this.options.center = latLng(this.doctor!.lat, this.doctor!.lng);
      let layer = marker([this.doctor!.lat, this.doctor!.lng], {
        title: this.doctor!.firstName + ' ' + this.doctor!.lastName,
        alt: this.doctor!.firstName + ' ' + this.doctor!.lastName,
        draggable: true,
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
      this.marker = layer;
      layer.on('dragend', (event: any) => {
        const position = event.target.getLatLng();
        this.doctorForm.patchValue({
          ...this.doctorForm.value,
          lat: position.lat,
          lng: position.lng
        });
      });
      this.isMapInitialized = true;
      this.options.layers.push(layer);
      console.log(this.options.layers);
      
    }
  }
  options: any = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 10,
        noWrap: true,
        detectRetina: true
      })
    ],
    zoom: 13,
    center: latLng(30.0444, 31.2357)
  }
  onMapReady(map: any) {
    this.map = map;
    this.map.on('click', (event: any) => {
      const position = event.latlng;
      this.marker.setLatLng(position);
      this.doctorForm.patchValue({
        ...this.doctorForm.value,
        lat: position.lat,
        lng: position.lng
      });
    });
  }
  pickLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.doctorForm.patchValue({
          ...this.doctorForm.value,
          lat: latitude,
          lng: longitude,
        });
        this.map.setView([latitude, longitude], 13);
        this.marker.setLatLng([latitude, longitude]);
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Geolocation is not supported by this browser.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        this.doctorForm.patchValue({
          image: file
        });
      }
    }
  }
  save() {
    if (this.doctorForm?.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }
    this.doctor?.birthDate.setDate(this.doctor?.birthDate.getDate() + 1)
    const data = {
      ...this.doctorForm.value,
      governorate: this.governorates.indexOf(this.doctorForm.value.governorate) + 1,
      id: this.doctor?.id,
      firstName: this.doctor?.firstName,
      lastName: this.doctor?.lastName,
      birthDate: this.doctor?.birthDate.toISOString().split('T')[0]
    };
    this.doctorService.updateProfile(data).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Success',
          text: 'Your profile has been updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/profile/doctor/']);
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: `An error occurred while updating your profile: ${err.error.Errors[0] || 'Please try again later.'}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
