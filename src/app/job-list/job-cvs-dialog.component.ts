// import { Component, Inject, OnInit } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { JobService } from '../services/job.service';

// @Component({
//   selector: 'app-job-cvs-dialog',
//   template: `
//     <h2 mat-dialog-title>CVs pour l'offre: {{ jobTitle }}</h2>
//     <div mat-dialog-content>
//       <div *ngIf="loading">Chargement des CVs...</div>
//       <div *ngIf="error" class="error">{{ error }}</div>
//       <mat-list *ngIf="cvs.length > 0">
//         <mat-list-item *ngFor="let cv of cvs">
//           <a [href]="cv.fileUrl" target="_blank" rel="noopener">{{ cv.applicantName }} - {{ cv.applicantEmail }}</a>
//         </mat-list-item>
//       </mat-list>
//       <div *ngIf="!loading && cvs.length === 0">Aucun CV trouvé pour cette offre.</div>
//     </div>
//     <div mat-dialog-actions align="end">
//       <button mat-button (click)="onClose()">Fermer</button>
//     </div>
//   `,
//   styles: [`
//     .error {
//       color: red;
//       margin: 10px 0;
//     }
//   `]
// })
// export class JobCVsDialogComponent implements OnInit {
//   jobId: string;
//   jobTitle: string;
//   cvs: any[] = [];
//   loading = false;
//   error = '';

//   constructor(
//     public dialogRef: MatDialogRef<JobCVsDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { jobId: string, jobTitle: string },
//     private jobService: JobService
//   ) {
//     this.jobId = data.jobId;
//     this.jobTitle = data.jobTitle;
//   }

//   ngOnInit(): void {
//     this.loadCVs();
//   }

//   loadCVs(): void {
//     this.loading = true;
//     this.jobService.getCVsByJobId(this.jobId).subscribe({
//       next: (cvs: any[]) => {
//         this.cvs = cvs;
//         this.loading = false;
//       },
//       error: (err: any) => {
//         this.error = 'Erreur lors du chargement des CVs.';
//         this.loading = false;
//       }
//     });
//   }

//   onClose(): void {
//     this.dialogRef.close();
//   }
// }
