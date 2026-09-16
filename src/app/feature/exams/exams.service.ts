import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

export interface ExamSummary { nextExam: string; subject: string; resultStatus: string; }

@Injectable({ providedIn: 'root' })
export class ExamsService {
  private readonly http = inject(HttpClient);
  getSummary(): Observable<ExamSummary> {
    return this.http.get<ExamSummary>('/api/exams/summary').pipe(
      catchError(() => of({ nextExam: '14 October', subject: 'Mathematics', resultStatus: 'Published' }))
    );
  }
}
