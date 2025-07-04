import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../../core/services/Dashboard.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-speciality-dialog',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-speciality-dialog.component.html',
  styleUrl: './add-speciality-dialog.component.css'
})
export class AddSpecialityDialogComponent {
  itemForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder,private dashboardService: DashboardService) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  get name() {
    return this.itemForm.get('name')!;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      console.log('Form Submitted:', this.itemForm.value);
      console.log('Selected File:', this.selectedFile);
      this.dashboardService.addSpeciality(
        this.itemForm.value.name,
        this.itemForm.value.description,
        this.selectedFile
      ).subscribe({
        next: (response) => {
          console.log('Speciality added successfully:', response);
        }
        , error: (error) => {
          console.error('Error adding speciality:', error);
        }
      });
      
      // Reset form after submission
      this.itemForm.reset();
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }
}
