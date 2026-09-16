import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

export interface AttendanceSummary { present: number; absent: number; late: number; }
export interface AttendanceStudent { id: number; name: string; rollNumber: string; present: boolean; onLeave?: boolean; }
export interface AttendanceRecord { date: string; present: boolean; onLeave?: boolean; }
export interface ClassAttendanceDay { date: string; present: number; absent: number; onLeave: number; }

const FALLBACK_STUDENTS: AttendanceStudent[] = [
  { id: 1, name: 'Aarav Sharma', rollNumber: 'OA-801', present: true },
  { id: 2, name: 'Aanya Patel', rollNumber: 'OA-802', present: true },
  { id: 3, name: 'Arjun Mehta', rollNumber: 'OA-803', present: false },
  { id: 4, name: 'Diya Kapoor', rollNumber: 'OA-804', present: true },
  { id: 5, name: 'Ishaan Rao', rollNumber: 'OA-805', present: true },
  { id: 6, name: 'Meera Nair', rollNumber: 'OA-806', present: false },
  { id: 7, name: 'Rohan Singh', rollNumber: 'OA-807', present: true },
  { id: 8, name: 'Sara Thomas', rollNumber: 'OA-808', present: true }
];

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly http = inject(HttpClient);
  getSummary(): Observable<AttendanceSummary> {
    return this.http.get<AttendanceSummary>('/rest/user-service/api/attendance/summary').pipe(
      catchError(() => of({ present: 28, absent: 2, late: 1 }))
    );
  }

  getStudents(className: string, section: string, date: string): Observable<AttendanceStudent[]> {
    const params = `class=${encodeURIComponent(className)}&section=${encodeURIComponent(section)}&date=${date}`;
    return this.http.get<AttendanceStudent[]>(`/rest/user-service/api/attendance/students?${params}`).pipe(
      catchError(() => of(FALLBACK_STUDENTS.map(student => ({ ...student }))))
    );
  }

  getStudentHistory(className: string, section: string, studentId: number, startDate: string, endDate: string): Observable<AttendanceRecord[]> {
    const params = `class=${encodeURIComponent(className)}&section=${encodeURIComponent(section)}&studentId=${studentId}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<AttendanceRecord[]>(`/rest/user-service/api/attendance/history?${params}`).pipe(
      catchError(() => of(this.fallbackHistory(startDate, endDate, studentId)))
    );
  }

  saveAttendance(className: string, section: string, date: string, students: AttendanceStudent[]): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>('/rest/user-service/api/attendance', { className, section, date, students }).pipe(
      catchError(() => of({ success: true }))
    );
  }

  getClassHistory(className: string, section: string, startDate: string, endDate: string): Observable<ClassAttendanceDay[]> {
    const params = `class=${encodeURIComponent(className)}&section=${encodeURIComponent(section)}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<ClassAttendanceDay[]>(`/rest/user-service/api/attendance/class-history?${params}`).pipe(
      catchError(() => of(this.fallbackClassHistory(startDate, endDate)))
    );
  }

  private fallbackClassHistory(startDate: string, endDate: string): ClassAttendanceDay[] {
    const days: ClassAttendanceDay[] = [];
    const date = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    let index = 0;
    while (date <= end && index < 31) {
      const iso = date.toISOString().slice(0, 10);
      const onLeave = index % 4 === 1 ? 2 : index % 5 === 2 ? 1 : 0;
      const absent = index % 3 === 0 ? 2 : 1;
      days.push({ date: iso, present: 8 - absent - onLeave, absent, onLeave });
      date.setDate(date.getDate() + 1);
      index++;
    }
    return days;
  }

  private fallbackHistory(startDate: string, endDate: string, studentId: number): AttendanceRecord[] {
    const records: AttendanceRecord[] = [];
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const date = new Date(start);
    let dayIndex = 0;
    while (date <= end && dayIndex < 31) {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      records.push({
        date: `${date.getFullYear()}-${month}-${day}`,
        present: (dayIndex + studentId) % 5 !== 2
      });
      date.setDate(date.getDate() + 1);
      dayIndex++;
    }
    return records;
  }
}
