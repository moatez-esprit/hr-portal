import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';
import { Job } from '../models/job.model';
import { MatDialog } from '@angular/material/dialog';
import { JobApplicationDialogComponent } from '../job-list/job-application-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-application-page',
  templateUrl: './job-application-page.component.html',
  styleUrls: ['./job-application-page.component.scss']
})
export class JobApplicationPageComponent implements OnInit {
  jobs: Job[] = [];

  constructor(
    private jobService: JobService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        // Filter out jobs with status 'closed'
        this.jobs = jobs.filter(job => job.status !== 'closed');
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du chargement des offres', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
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
}
