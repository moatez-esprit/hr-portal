import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../services/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-application-dialog',
  templateUrl: './job-application-dialog.component.html',
  styleUrls: ['./job-application-dialog.component.scss']
})
export class JobApplicationDialogComponent {
  applicationForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;
  isDragOver = false;
  coverLetterMaxLength = 500;

  constructor(
    public dialogRef: MatDialogRef<JobApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public job: any,
    private fb: FormBuilder,
    private jobService: JobService,
    private snackBar: MatSnackBar
  ) {
    this.applicationForm = this.fb.group({
      applicantName: ['', Validators.required],
      applicantEmail: ['', [Validators.required, Validators.email]],
      cvFile: [null, Validators.required],
      coverLetter: ['']
    });
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.applicationForm.patchValue({ cvFile: file });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.selectedFile = file;
      this.applicationForm.patchValue({ cvFile: file });
      event.dataTransfer.clearData();
    }
  }


  submitApplication(): void {
    if (this.applicationForm.invalid || !this.selectedFile) {
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('application', new Blob([JSON.stringify({
      jobOfferId: this.job.id,
      applicantName: this.applicationForm.value.applicantName,
      applicantEmail: this.applicationForm.value.applicantEmail
    })], { type: 'application/json' }));
    formData.append('cvFile', this.selectedFile);

    this.jobService.submitApplication(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open('Candidature envoyée avec succès!', 'Fermer', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.log('Application submission error:', error);
        const errorMessage = error.error?.message || error.message || '';
        if (errorMessage.toLowerCase().includes('already applied')) {
          this.snackBar.open('Vous avez déjà postulé à cette offre.', 'Fermer', { duration: 3000 });
        } else {
          this.snackBar.open('Erreur lors de l\'envoi de la candidature. Veuillez réessayer.', 'Fermer', { duration: 3000 });
        }
      }
    });
  }


  // Added method to safely check selectedFile name
  get selectedFileName(): string {
    return this.selectedFile ? this.selectedFile.name : '';
  }

  getFormProgress(): number {
    let progress = 0;
    if (this.applicationForm.get('applicantName')?.valid) progress += 33;
    if (this.applicationForm.get('applicantEmail')?.valid) progress += 33;
    if (this.selectedFile) progress += 34;
    return progress;
  }

  getFileSize(size: number): string {
    if (size < 1024) return size + ' bytes';
    else if (size < 1048576) return (size / 1024).toFixed(1) + ' KB';
    else return (size / 1048576).toFixed(1) + ' MB';
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.applicationForm.patchValue({ cvFile: null });
  }

  getCoverLetterLength(): number {
    return this.applicationForm.get('coverLetter')?.value.length || 0;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
