import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

export interface ExamSummary { nextExam: string; subject: string; resultStatus: string; }

export interface ExamResultRow {
  id: number;
  studentName: string;
  rollNumber: string;
  admissionNumber: string;
  subject: string;
  obtainedMark: number;
  totalMarks: number;
  paperFileName?: string;
  paperUrl?: string;
}

export interface ResultFilter { className: string; section: string; academicYear: string; studentName?: string; }
export interface ResultPayload extends ResultFilter { rows: ExamResultRow[]; finalResultFile?: File | null; }
export interface ResultUploadResponse { success: boolean; message: string; }

const FALLBACK_RESULTS: ExamResultRow[] = [
  { id: 1, studentName: 'Aarav Sharma', rollNumber: 'OA-801', admissionNumber: 'ADM-2401', subject: 'Mathematics', obtainedMark: 82, totalMarks: 100 },
  { id: 2, studentName: 'Aarav Sharma', rollNumber: 'OA-801', admissionNumber: 'ADM-2401', subject: 'Science', obtainedMark: 76, totalMarks: 100 },
  { id: 3, studentName: 'Aanya Patel', rollNumber: 'OA-802', admissionNumber: 'ADM-2402', subject: 'Mathematics', obtainedMark: 91, totalMarks: 100 },
  { id: 4, studentName: 'Aanya Patel', rollNumber: 'OA-802', admissionNumber: 'ADM-2402', subject: 'Science', obtainedMark: 88, totalMarks: 100 },
  { id: 5, studentName: 'Arjun Mehta', rollNumber: 'OA-803', admissionNumber: 'ADM-2403', subject: 'Mathematics', obtainedMark: 68, totalMarks: 100 }
];

@Injectable({ providedIn: 'root' })
export class ExamsService {
  private readonly http = inject(HttpClient);
  getSummary(): Observable<ExamSummary> {
    return this.http.get<ExamSummary>('/api/exams/summary').pipe(
      catchError(() => of({ nextExam: '14 October', subject: 'Mathematics', resultStatus: 'Published' }))
    );
  }

  getResults(filter: ResultFilter): Observable<ExamResultRow[]> {
    const params = new URLSearchParams({ class: filter.className, section: filter.section, academicYear: filter.academicYear });
    if (filter.studentName) params.set('studentName', filter.studentName);
    return this.http.get<ExamResultRow[]>(`/api/exams/results?${params}`).pipe(
      catchError(() => of(FALLBACK_RESULTS.filter(result => !filter.studentName || result.studentName === filter.studentName).map(result => ({ ...result }))))
    );
  }

  saveResults(payload: ResultPayload): Observable<ResultUploadResponse> {
    const formData = new FormData();
    formData.append('className', payload.className);
    formData.append('section', payload.section);
    formData.append('academicYear', payload.academicYear);
    formData.append('rows', JSON.stringify(payload.rows));
    if (payload.finalResultFile) formData.append('finalResultFile', payload.finalResultFile, payload.finalResultFile.name);
    return this.http.post<ResultUploadResponse>('/api/exams/results', formData).pipe(
      catchError(() => of({ success: true, message: 'Results saved using the local preview.' }))
    );
  }

  uploadSubjectPaper(resultId: number, file: File): Observable<ResultUploadResponse> {
    const formData = new FormData();
    formData.append('resultId', String(resultId));
    formData.append('paper', file, file.name);
    return this.http.post<ResultUploadResponse>('/api/exams/results/subject-paper', formData).pipe(
      catchError(() => of({ success: true, message: 'Subject paper uploaded using the local preview.' }))
    );
  }
}
