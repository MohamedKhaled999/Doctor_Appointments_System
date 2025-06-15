import { Component, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { AccountService } from '../../../../core/services/account.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterDoctor } from '../../../../core/interfaces/register-doctor';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { Icon, icon, latLng, marker, tileLayer } from 'leaflet';


import {
  maxFileSize
  , allowedFileTypes
} from '../../../../core/validators/file-validators';
import { Governorate } from '../../../../core/enums/governorate.enum';
import { Gender } from '../../../../core/models/doctor-register.model';

@Component({
  selector: 'app-doctor-register',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LeafletModule
  ]
})
export class DoctorRegisterComponent implements AfterViewInit {
  // ...
  doctorLatitude: number | null = null;
  doctorLongitude: number | null = null;

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  registerForm: FormGroup;
  showPassword = {
    password: false,
    confirmPassword: false
  };

  specialties: any[] = [];
  governorateOptions: { value: Governorate, label: string }[] = [];
  genderOptions: { value: Gender, label: string }[] = [];
  private map: any;
  private marker: any;
  isMapInitialized = false;
  MAX_FILE_SIZE = 2 * 1024 * 1024;
  ALLOWED_FILE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  selectedFileName: string = '';
  selectedFileSize: string = '';
  // Gender = Gender;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('DoctorRegisterComponent constructor called');
    this.genderOptions = Object.keys(Gender).map(key => ({
      value: Gender[key as keyof typeof Gender],
      label: key.charAt(0).toUpperCase() + key.slice(1)
    }));
    // this.genderOptions = Object.keys(Gender).map(key => ({
    //   value: Gender[key as keyof typeof Gender],
    //   label: key.charAt(0).toUpperCase() + key.slice(1) 
    // }));
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],

      birthDate: ['', Validators.required],
      Image: [null, [
        Validators.required,
        maxFileSize(this.MAX_FILE_SIZE),
        allowedFileTypes(this.ALLOWED_FILE_TYPES)

      ]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      governorate: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      lat: [30.0594629, Validators.required],
      lng: [31.3406953, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      specialtyID: ['', Validators.required],
      fees: [0, [Validators.required, Validators.min(0)]],
      waitingTime: [0, [Validators.required, Validators.min(0), Validators.max(60)]],
      about: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
    }, { validators: this.passwordMatchValidator });
  }

  async ngAfterViewInit(): Promise<void> {
    console.log('ngAfterViewInit called');
    if (isPlatformBrowser(this.platformId)) {
      console.log('Running in browser platform');
      setTimeout(async () => {
        console.log('Initializing map...');
        // await this.initMap();
        console.log('Loading specialties and governorates...');
        this.loadSpecialties();
        this.loadGovernorates();

        if (this.doctorLatitude && this.doctorLongitude) {
          console.log('Updating location from coordinates');
          this.updateLocation(this.doctorLatitude, this.doctorLongitude);
        }
      }, 0);
    }
  }
  initMap(): void {
    if (isPlatformBrowser(this.platformId)) {
      const initialLat = this.registerForm.value.lat;
      const initialLng = this.registerForm.value.lng;
      this.options.center = latLng(initialLat, initialLng);
      let layer = marker([initialLat, initialLng], {
        draggable: true,
        icon: icon({
          className: 'leaflet-marker-icon',
          ...Icon.Default.prototype.options,
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
        })
      });
      this.marker = layer;
      layer.on('dragend', (event: any) => {
        const position = event.target.getLatLng();
        this.updateLocation(position.lat, position.lng);
      });
      this.isMapInitialized = true;
      this.options.layers.push(layer);
      console.log(this.options.layers);

    }
  }
  options: any = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 13,
    center: latLng(30.0444, 31.2357)
  }
  onMapReady(map: any) {
    this.map = map;
    this.map.on('click', (event: any) => {
      const position = event.latlng;
      this.updateLocation(position.lat, position.lng);
    });
  }

  loadGovernorates() {
    console.log('Loading governorates');
    this.governorateOptions = Object.keys(Governorate)
      .filter(key => isNaN(Number(key)))
      .map(key => ({
        value: Governorate[key as keyof typeof Governorate],
        label: key
      }));

    console.log('Governorates loaded:', this.governorateOptions);
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    const valid = password === confirmPassword;
    console.log('Password match validation:', valid);
    return valid ? null : { mismatch: true };
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    console.log(`Toggling password visibility for: ${field}`);
    this.showPassword[field] = !this.showPassword[field];
  }

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     console.log('File selected:', file.name, 'Size:', file.size);
  //     if (file.size > 2 * 1024 * 1024) {
  //       console.warn('File size exceeds limit');
  //       Swal.fire({
  //         title: "Error",
  //         text: "Maximum allowed size is 2 MB",
  //         icon: "error"
  //       });
  //       return;
  //     }
  //     this.registerForm.patchValue({ Image: file });
  //   }
  // }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFileName = file.name;
      this.selectedFileSize = this.formatFileSize(file.size);

      this.registerForm.patchValue({
        Image: file
      });

      this.registerForm.get('Image')?.updateValueAndValidity();
    } else {
      this.selectedFileName = '';
      this.selectedFileSize = '';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  updateLocation(lat: number, lng: number): void {
    console.log('Updating location to:', lat, lng);
    if (!this.map) {
      console.warn('Map is not initialized');
      return;
    }
    this.registerForm.patchValue({
      ...this.registerForm.value,
      lat: lat,
      lng: lng
    });
    // const L = (window as any).L;
    // const newLatLng = L.latLng(lat, lng);
    this.map.setView([lat, lng], 13);

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    }
    //  else {
    //   this.marker = L.marker(newLatLng, { draggable: true }).addTo(this.map);
    // }
  }

  pickLocation() {
    console.log('pickLocation called');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Geolocation success:', position.coords);
          this.updateLocation(position.coords.latitude, position.coords.longitude);
          if (this.map) {
            this.map.setView([position.coords.latitude, position.coords.longitude], 18);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          Swal.fire({
            title: "Error",
            text: "Could not get your location.",
            icon: "error",
            color: "#004085",
            confirmButtonColor: "#004085",
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.warn('Geolocation not supported');
      Swal.fire({
        title: "Error",
        text: "Geolocation is not supported by this browser.",
        icon: "error",
        color: "#004085",
        confirmButtonColor: "#004085",
      });
    }
  }

  loadSpecialties() {
    console.log('Loading specialties...');
    this.accountService.getSpecialties().subscribe({
      next: (data: any) => {
        console.log('Specialties loaded:', data);
        this.specialties = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load specialties', err);

      }
    });
  }

  onSubmit() {
    console.log('Form submission started');
    console.log(this.registerForm);
    if (this.registerForm.invalid) {
      console.warn('Form is invalid');
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    const formData = new FormData();
    const formValue = this.registerForm.value;

    formValue.lat = parseFloat(formValue.lat);
    formValue.lng = parseFloat(formValue.lng);

    Object.keys(formValue).forEach(key => {
      if (key !== 'Image' && key !== 'confirmPassword') {
        formData.append(key, formValue[key]);
      }
    });

    if (formValue.Image) {
      formData.append('Image', formValue.Image);
    }

    console.log('Submitting doctor registration:', formValue);

    this.accountService.registerDoctor(formData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Your account has been created successfully',
          confirmButtonText: 'OK',
          color: "#004085",
          confirmButtonColor: "#004085",
        })

      },
      error: (error) => {

        const errorMessage = error.error?.Errors ||
          error.error?.message ||
          (Array.isArray(error.error) ? error.error.join(', ') :
            'Registration failed. Please try again');

        Swal.fire({
          icon: 'warning',
          title: 'Registration Error',
          text: errorMessage,
          confirmButtonText: 'OK',
          color: "#004085",
          confirmButtonColor: "#004085",
        });
      }
    });

    // },
    // error: (err: HttpErrorResponse) => {
    //   console.error('Registration failed:', err);
    //   let errorMessage = "Registration failed";
    //   if (err.error && typeof err.error === 'string') {
    //     errorMessage = err.error;
    //   } else if (err.error && Array.isArray(err.error)) {
    //     errorMessage = err.error.join('\n');
    //   } else if (err.error && err.error.errors) {
    //     errorMessage = Object.values(err.error.errors).join('\n');
    //   }

    //   Swal.fire({
    //     title: "Error",
    //     text: errorMessage,
    //     icon: "error"
    //   });
  }


  private markFormGroupTouched(formGroup: FormGroup) {
    console.log('Marking form group as touched');
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
