export interface Job {
  id?: string;
  title: string;
  department: string;
  location: string;
  salaryRange: string;
  status: 'open' | 'closed';
  description: string;
  requirements: string[];
  postedDate: Date;
  attachmentUrl?: string;
}