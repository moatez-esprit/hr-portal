import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-job-cvs-dialog',
  template: `
    <h2 mat-dialog-title>CVs pour l'offre: {{ jobTitle }}</h2>
    <div mat-dialog-content>
      <div *ngIf="loading">Chargement des CVs...</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      <mat-list *ngIf="cvs.length > 0">
        <mat-list-item *ngFor="let cv of cvs">
          <a [href]="getDownloadUrl(cv.id)" target="_blank" rel="noopener">{{ cv.cvFileName || 'Télécharger le CV' }}</a>
        </mat-list-item>
      </mat-list>
      <div *ngIf="!loading && cvs.length === 0">Aucun CV trouvé pour cette offre.</div>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Fermer</button>
    </div>
  `,
  styles: [`.error { color: red; margin: 10px 0; }`]
})
export class JobCVsDialogComponent implements OnInit {
  cvs: any[] = [];
  loading = false;
  error = '';
  jobId: number;
  jobTitle: string;

  constructor(
    public dialogRef: MatDialogRef<JobCVsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { jobId: number, jobTitle: string },
    private jobService: JobService
  ) {
    this.jobId = data.jobId;
    this.jobTitle = data.jobTitle;
  }

  ngOnInit(): void {
    this.loadCVs();
  }

  loadCVs(): void {
    this.loading = true;
    this.jobService.getCVsByJobId(this.jobId.toString()).subscribe({
      next: (cvs: any[]) => {
        this.cvs = cvs;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des CVs.';
        this.loading = false;
      }
    });
  }

  getDownloadUrl(cvId: number): string {
    return `http://localhost:8081/api/applications/${cvId}/cv`;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  downloadCV(cvId: number, fileName: string) {
  this.jobService.downloadCV(cvId).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'cv.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

  downloadOrOpenCV(cvId: number, fileName: string, event: MouseEvent) {
  event.preventDefault();
  this.jobService.downloadCV(cvId).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    // Try to open in new tab
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      const contentType = blob.type || 'application/pdf';
      const reader = new FileReader();
      reader.onload = () => {
        const base64data = reader.result as string;
        newWindow.document.write(
          `<iframe src="${base64data}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      };
      reader.readAsDataURL(blob);
    } else {
      // If popup blocked, fallback to download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'cv.pdf';
      a.click();
    }
    window.URL.revokeObjectURL(url);
  });
}
}