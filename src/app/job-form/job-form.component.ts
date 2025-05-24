import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Job } from '../models/job.model';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {
  job: Job = {
    title: '',
    department: '',
    location: '',
    salaryRange: '',
    status: 'open',
    description: '',
    requirements: [],
    postedDate: new Date()
  };

  isEditMode = false;
  requirementInput = '';
  uploadProgress = 0;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.isEditMode = true;
      this.loadJob(jobId);
    }
  }

  loadJob(id: string): void {
    this.isLoading = true;
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        this.isLoading = false;
        if (job) {
          this.job = { ...job };
          console.log('Job loaded for editing:', job.title);
        } else {
          this.snackBar.open('Offre d\'emploi non trouvée', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/jobs']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading job:', error);
        this.snackBar.open('Erreur lors du chargement de l\'offre', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/jobs']);
      }
    });
  }

  onSubmit(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;

    if (this.isEditMode) {
      this.jobService.updateJob(this.job).subscribe({
        next: (updatedJob) => {
          this.isLoading = false;
          this.snackBar.open('Offre d\'emploi mise à jour avec succès!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          console.log('Job updated successfully:', updatedJob.title);
          this.router.navigate(['/jobs']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating job:', error);
          this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      // Create new job
      const { id, ...jobData } = this.job; // Remove id for creation
      this.jobService.createJob(jobData).subscribe({
        next: (newJob) => {
          this.isLoading = false;
          this.snackBar.open('Offre d\'emploi créée avec succès!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          console.log('New job created successfully:', newJob.title);
          this.router.navigate(['/jobs']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating job:', error);
          this.snackBar.open('Erreur lors de la création', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  addRequirement(): void {
    if (this.requirementInput.trim()) {
      this.job.requirements.push(this.requirementInput.trim());
      this.requirementInput = '';
    }
  }

  removeRequirement(index: number): void {
    this.job.requirements.splice(index, 1);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Simulate file upload progress
      this.uploadProgress = 0;
      const interval = setInterval(() => {
        this.uploadProgress += 10;
        if (this.uploadProgress >= 100) {
          clearInterval(interval);
          this.job.attachmentUrl = `uploads/${file.name}`;
          this.uploadProgress = 0;
          console.log('File uploaded:', file.name);
        }
      }, 100);
    }
  }

  removeAttachment(): void {
    this.job.attachmentUrl = undefined;
    console.log('Attachment removed');
  }

  // Helper method to check if form is valid
  isFormValid(): boolean {
    return !!(this.job.title && this.job.department && this.job.location && this.job.description);
  }
}
