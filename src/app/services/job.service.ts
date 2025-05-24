import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Job } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsSubject = new BehaviorSubject<Job[]>([]);
  public jobs$ = this.jobsSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const initialJobs: Job[] = [
      {
        id: '1',
        title: 'Développeur Frontend',
        department: 'Engineering',
        location: 'Paris, France',
        salaryRange: '45000 - 60000 €',
        status: 'open',
        description: 'Nous recherchons un développeur frontend expérimenté pour rejoindre notre équipe dynamique.',
        requirements: ['Angular', 'TypeScript', '3+ années d\'expérience', 'HTML/CSS'],
        postedDate: new Date('2023-12-01')
      },
      {
        id: '2',
        title: 'Chef de Projet',
        department: 'Operations',
        location: 'Lyon, France',
        salaryRange: '50000 - 70000 €',
        status: 'open',
        description: 'Poste de chef de projet pour équipe agile.',
        requirements: ['Gestion de projet', 'Agile/Scrum', '5+ années d\'expérience'],
        postedDate: new Date('2023-11-28')
      }
    ];
    
    this.jobsSubject.next(initialJobs);
  }

  // Get all jobs
  getJobs(): Observable<Job[]> {
    return this.jobs$;
  }

  // Get current jobs array (synchronous)
  getCurrentJobs(): Job[] {
    return this.jobsSubject.value;
  }

  // Get job by ID
  getJobById(id: string): Observable<Job | undefined> {
    const jobs = this.getCurrentJobs();
    const job = jobs.find(j => j.id === id);
    return of(job);
  }

  // Create new job
  createJob(job: Omit<Job, 'id'>): Observable<Job> {
    const newJob: Job = {
      ...job,
      id: this.generateId(),
      postedDate: new Date()
    };

    const currentJobs = this.getCurrentJobs();
    const updatedJobs = [newJob, ...currentJobs]; // Add to beginning for immediate visibility
    this.jobsSubject.next(updatedJobs);

    return of(newJob);
  }

  // Update existing job
  updateJob(updatedJob: Job): Observable<Job> {
    const currentJobs = this.getCurrentJobs();
    const jobIndex = currentJobs.findIndex(job => job.id === updatedJob.id);
    
    if (jobIndex !== -1) {
      const updatedJobs = [...currentJobs];
      updatedJobs[jobIndex] = { ...updatedJob };
      this.jobsSubject.next(updatedJobs);
    }

    return of(updatedJob);
  }

  // Delete job
  deleteJob(id: string): Observable<boolean> {
    const currentJobs = this.getCurrentJobs();
    const filteredJobs = currentJobs.filter(job => job.id !== id);
    this.jobsSubject.next(filteredJobs);
    return of(true);
  }

  // Helper method to generate unique IDs
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Get statistics
  getOpenJobsCount(): number {
    return this.getCurrentJobs().filter(job => job.status === 'open').length;
  }

  getRecentJobsCount(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.getCurrentJobs().filter(job => job.postedDate >= oneWeekAgo).length;
  }
}