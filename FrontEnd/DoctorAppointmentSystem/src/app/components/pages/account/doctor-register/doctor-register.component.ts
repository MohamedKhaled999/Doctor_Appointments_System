import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../../core/services/account.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { DoctorRegisterVM } from '../../../../core/models/doctor-register.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-register',
  standalone: true,
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class DoctorRegisterComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  registerForm: FormGroup;
  showPassword = {
    password: false,
    confirmPassword: false
  };

  specialties: any[] = [];
  governorateOptions: { value: string, label: string }[] = [];
  private map: any;
  private marker: any;

  Gender = {
    Male: 'Male',
    Female: 'Female'
  };

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // Personal Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      image: [null],
      Gender: ['', Validators.required],

      // Contact Information
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      governorate: ['', Validators.required],
      address: ['', Validators.required],
      lat: [30.0594629],
      lng: [31.3406953],

      // Account Credentials
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],

      // Professional Details
      specialtyID: ['', Validators.required],
      fees: ['', [Validators.required, Validators.min(0)]],
      waitingTime: ['', [Validators.required, Validators.min(0), Validators.max(60)]],
      about: ['', [Validators.required, Validators.maxLength(500)]]
    }, { validators: this.passwordMatchValidator });
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initMap();
    this.loadSpecialties();
    this.loadGovernorates();
  }

  async initMap(): Promise<void> {
    const L = await import('leaflet');

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.registerForm.value.lat, this.registerForm.value.lng],
      10
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker(
      [this.registerForm.value.lat, this.registerForm.value.lng],
      { draggable: true }
    ).addTo(this.map).bindPopup("Doctor's Clinic");

    this.map.on('click', (e: any) => {
      this.updateLocation(e.latlng.lat, e.latlng.lng);
    });

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.updateLocation(position.lat, position.lng);
    });
  }

  loadGovernorates() {
    this.governorateOptions = [
      { value: 'cairo', label: 'Cairo' },
      { value: 'giza', label: 'Giza' },
      { value: 'alexandria', label: 'Alexandria' }
    ];
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    this.showPassword[field] = !this.showPassword[field];
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.registerForm.patchValue({
        image: file
      });
    }
  }

  updateLocation(lat: number, lng: number) {
    this.registerForm.patchValue({
      lat: lat,
      lng: lng
    });
    this.marker.setLatLng([lat, lng]).openPopup();
  }

  pickLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.updateLocation(position.coords.latitude, position.coords.longitude);
        this.map.setView([position.coords.latitude, position.coords.longitude], 18);
      },
      () => {
        Swal.fire({
          title: "Error",
          text: "An error has occurred, please try again",
          icon: "error"
        });
      }
    );
  }

  loadSpecialties() {
    this.accountService.getSpecialties().subscribe({
      next: (data: any) => {
        this.specialties = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load specialties', err);
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      Object.keys(this.registerForm.value).forEach(key => {
        if (key !== 'image') {
          formData.append(key, this.registerForm.value[key]);
        }
      });

      if (this.registerForm.value.image) {
        formData.append('image', this.registerForm.value.image);
      }

      this.accountService.registerDoctor(formData).subscribe({
        next: () => {
          Swal.fire({
            title: "Success!",
            text: "Doctor registered successfully",
            icon: "success"
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          Swal.fire({
            title: "Error",
            text: err.error || "Registration failed",
            icon: "error"
          });
        }
      });
    }
  }
}
