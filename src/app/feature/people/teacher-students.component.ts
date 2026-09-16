import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminStudent, PeopleService } from './people.service';

@Component({
  selector: 'app-teacher-students',
  imports: [RouterLink],
  templateUrl: './teacher-students.component.html'
})
export class TeacherStudentsComponent {
  private readonly peopleService = inject(PeopleService);
  protected readonly classOptions = [6, 7, 8, 9, 10];
  protected readonly sectionOptions = ['A', 'B', 'C'];
  protected readonly selectedClass = signal(8);
  protected readonly selectedSection = signal('A');
  protected readonly students = signal<AdminStudent[]>([]);

  constructor() {
    this.loadStudents();
  }

  protected onClassChange(event: Event): void {
    this.selectedClass.set(Number((event.target as HTMLSelectElement).value));
    this.loadStudents();
  }

  protected onSectionChange(event: Event): void {
    this.selectedSection.set((event.target as HTMLSelectElement).value);
    this.loadStudents();
  }

  private loadStudents(): void {
    this.peopleService.getStudentsByClassAndSection(this.selectedClass(), this.selectedSection())
      .subscribe(students => this.students.set(students));
  }
}