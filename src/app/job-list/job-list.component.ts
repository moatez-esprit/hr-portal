import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Job } from '../models/job.model';
import { JobService } from '../services/job.service';
import { JobApplicationDialogComponent } from './job-application-dialog.component';
import { JobCVsDialogComponent } from './job-cvs-dialog.component';


@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  displayedColumns: string[] = ['title', 'location', 'salary', 'status', 'postedDate', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadJobs(): void {
    this.jobService.getJobs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (jobs) => {
          this.jobs = jobs;
          console.log('Jobs updated:', jobs.length);
        },
        error: (error) => {
          console.error('Error loading jobs:', error);
          this.snackBar.open('Erreur lors du chargement des offres', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  getOpenJobsCount(): number {
    return this.jobs.filter(job => job.status === 'open').length;
  }

  getRecentJobsCount(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.jobs.filter(job => new Date(job.postedDate) >= oneWeekAgo).length;
  }

  viewJob(job: Job): void {
    const dialogRef = this.dialog.open(JobViewDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: job,
      autoFocus: false,
      restoreFocus: false
    });
  }
  viewCVs(job: Job): void {
    this.dialog.open(JobCVsDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { jobId: job.id!, jobTitle: job.title },
      autoFocus: false,
      restoreFocus: false
    });
  }
  deleteJob(jobId: string): void {
    const jobToDelete = this.jobs.find(job => job.id === jobId);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer l'offre "${jobToDelete?.title}" ? Cette action est irréversible.`
      },
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jobService.deleteJob(jobId).subscribe({
          next: () => {
            this.snackBar.open('Offre d\'emploi supprimée avec succès!', 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error deleting job:', error);
            this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  openApplicationDialog(job: Job): void {
    const dialogRef = this.dialog.open(JobApplicationDialogComponent, {
      width: '600px',
      data: job,
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Candidature envoyée avec succès!', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  
  // viewCVs(job: Job): void {
  //   const dialogRef = this.dialog.open(JobCVsDialogComponent, {
  //     width: '600px',
  //     maxWidth: '90vw',
  //     maxHeight: '90vh',
  //     data: { jobId: job.id!, jobTitle: job.title },
  //     autoFocus: false,
  //     restoreFocus: false
  //   });
  // }
}

// Confirmation Dialog Component
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p class="dialog-message">{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()" class="cancel-button">
          Annuler
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()" class="confirm-button">
          <mat-icon>delete</mat-icon>
          Supprimer
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 300px;
    }
    
    .dialog-message {
      margin: 16px 0;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.87);
    }
    
    mat-dialog-content {
      padding: 0 24px;
      margin: 0;
    }
    
    mat-dialog-actions {
      padding: 8px 24px 24px;
      margin: 0;
      gap: 8px;
    }
    
    .cancel-button {
      margin-right: 8px;
    }
    
    .confirm-button {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

// Job View Dialog Component
@Component({
  selector: 'app-job-view-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <div class="job-details">
          <div class="detail-section">
            <div class="detail-row">
              <mat-icon class="detail-icon">business</mat-icon>
              <div class="detail-content">
                <strong>Département:</strong>
                <span>{{ data.department }}</span>
              </div>
            </div>
            
            <div class="detail-row">
              <mat-icon class="detail-icon">location_on</mat-icon>
              <div class="detail-content">
                <strong>Localisation:</strong>
                <span>{{ data.location }}</span>
              </div>
            </div>
            
            <div class="detail-row">
              <mat-icon class="detail-icon">attach_money</mat-icon>
              <div class="detail-content">
                <strong>Salaire:</strong>
                <span>{{ data.salaryRange }}</span>
              </div>
            </div>
            
            <div class="detail-row">
              <mat-icon class="detail-icon">info</mat-icon>
              <div class="detail-content">
                <strong>Statut:</strong>
                <mat-chip [ngClass]="data.status === 'open' ? 'status-open' : 'status-closed'">
                  {{ data.status === 'open' ? 'Ouvert' : 'Fermé' }}
                </mat-chip>
              </div>
            </div>
            
            <div class="detail-row">
              <mat-icon class="detail-icon">schedule</mat-icon>
              <div class="detail-content">
                <strong>Date de publication:</strong>
                <span>{{ data.postedDate | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          </div>
          
          <div class="description-section">
            <h4><mat-icon>description</mat-icon> Description</h4>
            <p class="description-text">{{ data.description }}</p>
          </div>
          
          <div class="requirements-section" *ngIf="data.requirements && data.requirements.length > 0">
            <h4><mat-icon>checklist</mat-icon> Exigences</h4>
            <ul class="requirements-list">
              <li *ngFor="let req of data.requirements">
                <mat-icon class="req-icon">check_circle</mat-icon>
                {{ req }}
              </li>
            </ul>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onClose()" class="close-button">
          Fermer
        </button>
        <button mat-raised-button color="primary" [routerLink]="['/jobs/edit', data.id]" (click)="onClose()" class="edit-button">
          <mat-icon>edit</mat-icon>
          Modifier
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      max-width: 600px;
      min-width: 400px;
    }
    
    .job-details {
      padding: 0;
    }
    
    .detail-section {
      margin-bottom: 24px;
    }
    
    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      gap: 12px;
    }
    
    .detail-icon {
      color: #3f51b5;
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }
    
    .detail-content strong {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
    }
    
    .detail-content span {
      color: rgba(0, 0, 0, 0.6);
    }
    
    .description-section, .requirements-section {
      margin-bottom: 24px;
    }
    
    .description-section h4, .requirements-section h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px 0;
      color: #3f51b5;
      font-weight: 500;
    }
    
    .description-text {
      margin: 0;
      line-height: 1.6;
      color: rgba(0, 0, 0, 0.87);
    }
    
    .requirements-list {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    
    .requirements-list li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: rgba(0, 0, 0, 0.87);
    }
    
    .req-icon {
      color: #4caf50;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .status-open {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .status-closed {
      background-color: #ffebee;
      color: #c62828;
    }
    
    mat-dialog-content {
      padding: 0 24px;
      margin: 0;
      max-height: 60vh;
      overflow-y: auto;
    }
    
    mat-dialog-actions {
      padding: 16px 24px 24px;
      margin: 0;
      gap: 8px;
    }
    
    .close-button {
      margin-right: 8px;
    }
    
    .edit-button {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `]
})
export class JobViewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<JobViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Job
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
