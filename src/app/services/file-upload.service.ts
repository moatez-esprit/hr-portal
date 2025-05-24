import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  uploadFile(file: File): Observable<string> {
    // Simulate file upload - in a real app, this would upload to a server
    const mockUrl = `https://example.com/uploads/${file.name}`;
    return of(mockUrl).pipe(delay(1000)); // Simulate network delay
  }

  validateFile(file: File): boolean {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }
}