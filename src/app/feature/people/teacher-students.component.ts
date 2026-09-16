import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PeopleService, StudentDirectoryEntry } from './people.service';

@Component({
  selector: 'app-teacher-students',
  imports: [RouterLink],
  templateUrl: './teacher-students.component.html'
})
export class TeacherStudentsComponent {
  private readonly peopleService = inject(PeopleService);
  protected readonly classOptions = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  protected readonly sectionOptions = ['A', 'B', 'C'];
  protected readonly selectedClass = signal('Class 8');
  protected readonly selectedSection = signal('A');
  protected readonly students = signal<StudentDirectoryEntry[]>([]);

  constructor() {
    this.loadStudents();
  }

  protected onClassChange(event: Event): void {
    this.selectedClass.set((event.target as HTMLSelectElement).value);
    this.loadStudents();
  }

  protected onSectionChange(event: Event): void {
    this.selectedSection.set((event.target as HTMLSelectElement).value);
    this.loadStudents();
  }

  private loadStudents(): void {
    this.peopleService.getStudentDirectory(this.selectedClass(), this.selectedSection())
      .subscribe(students => this.students.set(students));
  }
}