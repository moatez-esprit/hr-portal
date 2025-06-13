import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:8081/api/offres';

  constructor(private http: HttpClient) {}

  // Get all jobs
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  // Get job by ID
  getJobById(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  // Create new job
  createJob(job: Omit<Job, 'id'>): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }

  // Update existing job
  updateJob(updatedJob: Job): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${updatedJob.id}`, updatedJob);
  }

  // Delete job
  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Upload file for a job offer
  uploadFile(id: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/upload`, formData, { responseType: 'text' });
  }
}
