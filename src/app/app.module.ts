import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JobListComponent, ConfirmDialogComponent, JobViewDialogComponent } from './job-list/job-list.component';
import { JobFormComponent } from './job-form/job-form.component';
import {MatLegacyChipsModule} from "@angular/material/legacy-chips";
import { JobApplicationPageComponent } from './job-application-page/job-application-page.component';
import { JobApplicationDialogComponent } from './job-list/job-application-dialog.component';
import { JobCVsDialogComponent } from './job-list/job-cvs-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import {CvBuilderModule} from "./cv-builder/cv-builder.module";

@NgModule({
  declarations: [
    AppComponent,
    JobListComponent,
    ConfirmDialogComponent,
    JobViewDialogComponent,
    JobFormComponent,
    JobApplicationPageComponent,
    JobApplicationDialogComponent,
    JobCVsDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    // Angular Material Modules
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatLegacyProgressSpinnerModule,
    MatLegacyChipsModule,
    HttpClientModule,
    // CV Builder Module
    CvBuilderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
