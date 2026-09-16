import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

export interface PeopleSummary { students: number; teachers: number; classmates: number; }
export interface StudentDirectoryEntry {
  id: number;
  name: string;
  rollNumber: string;
  className: string;
  section: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  parentRelation: string;
}
export interface AdminStudent {
  id: number | null;
  name: string;
  gender: string;
  email: string;
  admissionNumber: number;
  rollNumber: number;
  classId: number;
  sectionName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  address: string;
  parentPhone: string;
}
export interface AdminTeacher {
  id: number | null;
  name: string;
  gender: string;
  email: string;
  username: string;
  employeeId: string;
  qualification: string;
  specialization: string;
  joiningDate: string;
  experienceYears: number;
  address: string;
  phone: string;
  dateOfJoining?: string;
  experience?: number;
}
interface StudentResponse {
  status: string;
  code: number;
  message: string;
  data: AdminStudent[];
}
interface TeacherResponse {
  status: string;
  code: number;
  message: string;
  data: AdminTeacher[];
}
interface TeacherDetailResponse {
  status: string;
  code: number;
  message: string;
  data: AdminTeacher;
}
export interface Classmate { id: number; name: string; rollNumber: string; photoUrl: string; }
export interface TeacherContact { id: number; name: string; subject: string; phone: string; email: string; isClassTeacher: boolean; photoUrl: string; }

const FALLBACK_DIRECTORY: StudentDirectoryEntry[] = [
  { id: 1, name: 'Aarav Sharma', rollNumber: 'OA-801', className: 'Class 8', section: 'A', gender: 'Male', parentName: 'Rajesh Sharma', parentPhone: '+1 555 0101', parentRelation: 'Father' },
  { id: 2, name: 'Aanya Patel', rollNumber: 'OA-802', className: 'Class 8', section: 'A', gender: 'Female', parentName: 'Neha Patel', parentPhone: '+1 555 0102', parentRelation: 'Mother' },
  { id: 3, name: 'Arjun Mehta', rollNumber: 'OA-803', className: 'Class 8', section: 'A', gender: 'Male', parentName: 'Vikram Mehta', parentPhone: '+1 555 0103', parentRelation: 'Father' },
  { id: 4, name: 'Diya Kapoor', rollNumber: 'OA-804', className: 'Class 8', section: 'A', gender: 'Female', parentName: 'Pooja Kapoor', parentPhone: '+1 555 0104', parentRelation: 'Mother' },
  { id: 5, name: 'Ishaan Rao', rollNumber: 'OA-805', className: 'Class 8', section: 'A', gender: 'Male', parentName: 'Sanjay Rao', parentPhone: '+1 555 0105', parentRelation: 'Father' },
  { id: 6, name: 'Meera Nair', rollNumber: 'OA-806', className: 'Class 8', section: 'A', gender: 'Female', parentName: 'Anita Nair', parentPhone: '+1 555 0106', parentRelation: 'Mother' },
  { id: 7, name: 'Rohan Singh', rollNumber: 'OA-807', className: 'Class 8', section: 'A', gender: 'Male', parentName: 'Harpreet Singh', parentPhone: '+1 555 0107', parentRelation: 'Father' },
  { id: 8, name: 'Sara Thomas', rollNumber: 'OA-808', className: 'Class 8', section: 'A', gender: 'Female', parentName: 'Maria Thomas', parentPhone: '+1 555 0108', parentRelation: 'Mother' },
  { id: 9, name: 'Kabir Joshi', rollNumber: 'OA-701', className: 'Class 7', section: 'B', gender: 'Male', parentName: 'Nitin Joshi', parentPhone: '+1 555 0109', parentRelation: 'Father' },
  { id: 10, name: 'Ira Menon', rollNumber: 'OA-702', className: 'Class 7', section: 'B', gender: 'Female', parentName: 'Lakshmi Menon', parentPhone: '+1 555 0110', parentRelation: 'Mother' }
];

@Injectable({ providedIn: 'root' })
export class PeopleService {
  private readonly http = inject(HttpClient);
  getSummary(): Observable<PeopleSummary> {
    return this.http.get<PeopleSummary>('/rest/user-service/api/people/summary').pipe(
      catchError(() => of({ students: 324, teachers: 28, classmates: 31 }))
    );
  }

  getStudentDirectory(className: string, section: string): Observable<StudentDirectoryEntry[]> {
    const params = `class=${encodeURIComponent(className)}&section=${encodeURIComponent(section)}`;
    return this.http.get<StudentDirectoryEntry[]>(`/rest/user-service/api/people/students?${params}`).pipe(
      catchError(() => of(FALLBACK_DIRECTORY.filter(student =>
        student.className === className && student.section === section
      ).map(student => ({ ...student }))))
    );
  }

  getStudentsByClassAndSection(classId: number, section: string): Observable<AdminStudent[]> {
    return this.http.get<StudentResponse>(`/rest/user-service/api/v1/students/class/${classId}/section/${encodeURIComponent(section)}`)
      .pipe(map(response => response.data));
  }

  getAdminTeachers(): Observable<AdminTeacher[]> {
    return this.http.get<TeacherResponse>('/rest/user-service/api/v1/teachers')
      .pipe(map(response => response.data.map(teacher => this.normalizeTeacher(teacher))));
  }

  getAdminTeacher(id: number): Observable<AdminTeacher> {
    return this.http.get<TeacherDetailResponse>(`/rest/user-service/api/v1/teachers/${id}`)
      .pipe(map(response => this.normalizeTeacher(response.data)));
  }

  updateStudent(student: AdminStudent): Observable<void> {
    return this.http.put<void>(`/rest/user-service/api/v1/students/${student.id}`, student);
  }

  createStudent(student: AdminStudent): Observable<void> {
    return this.http.post<void>('/rest/user-service/api/v1/students', student);
  }

  updateTeacher(teacher: AdminTeacher): Observable<void> {
    return this.http.put<void>(`/rest/user-service/api/v1/teachers/${teacher.id}`, teacher);
  }

  createTeacher(teacher: AdminTeacher): Observable<void> {
    return this.http.post<void>('/rest/user-service/api/v1/teachers', teacher);
  }

  getClassmates(studentId: number): Observable<Classmate[]> {
    return this.http.get<Classmate[]>(`/rest/user-service/api/people/classmates?studentId=${studentId}`).pipe(
      catchError(() => of(FALLBACK_DIRECTORY.slice(0, 8).filter(student => student.id !== studentId).map(student => ({
        id: student.id, name: student.name, rollNumber: student.rollNumber, photoUrl: `https://i.pravatar.cc/160?img=${student.id + 10}`
      }))))
    );
  }

  private normalizeTeacher(teacher: AdminTeacher): AdminTeacher {
    return {
      ...teacher,
      joiningDate: teacher.joiningDate || teacher.dateOfJoining || '',
      experienceYears: teacher.experienceYears ?? teacher.experience ?? 0
    };
  }

  getTeachers(studentId: number): Observable<TeacherContact[]> {
    return this.http.get<TeacherContact[]>(`/rest/user-service/api/people/teachers?studentId=${studentId}`).pipe(
      catchError(() => of([
        { id: 1, name: 'Maya Wilson', subject: 'Class Teacher · Mathematics', phone: '+1 555 0201', email: 'maya.wilson@oakridge.edu', isClassTeacher: true, photoUrl: 'https://i.pravatar.cc/160?img=47' },
        { id: 2, name: 'Daniel Brooks', subject: 'Science', phone: '+1 555 0202', email: 'daniel.brooks@oakridge.edu', isClassTeacher: false, photoUrl: 'https://i.pravatar.cc/160?img=12' },
        { id: 3, name: 'Olivia Carter', subject: 'English', phone: '+1 555 0203', email: 'olivia.carter@oakridge.edu', isClassTeacher: false, photoUrl: 'https://i.pravatar.cc/160?img=32' }
      ]))
    );
  }
}
