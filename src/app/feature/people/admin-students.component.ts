import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminStudent, PeopleService } from './people.service';

@Component({
  selector: 'app-admin-students',
  imports: [RouterLink],
  templateUrl: './admin-students.component.html',
  styleUrl: './admin-people-management.css'
})
export class AdminStudentsComponent {
  private readonly peopleService = inject(PeopleService);
  protected readonly fields = ['name', 'rollNumber', 'admissionNumber', 'dob', 'address', 'fatherName', 'motherName', 'parentMobile', 'className', 'section', 'email'];
  protected readonly classOptions = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  protected readonly manageClassOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  protected readonly sectionOptions = ['A', 'B', 'C'];
  protected readonly form: Record<string, string> = {};
  protected activeTab: 'add' | 'manage' = 'add';
  protected readonly selectedClassId = signal(2);
  protected readonly selectedSection = signal('B');
  protected readonly students = signal<AdminStudent[]>([]);
  protected readonly loadingStudents = signal(false);
  protected message = '';
  protected error = '';

  protected labelFor(field: string): string {
    return { rollNumber: 'Roll no', admissionNumber: 'Admission no', dob: 'Date of birth', className: 'Class', parentMobile: 'Parent mobile' }[field] ?? field;
  }

  protected updateField(field: string, event: Event): void {
    this.form[field] = (event.target as HTMLInputElement).value;
  }

  protected save(): void {
    if (this.fields.some(field => !this.form[field]?.trim())) {
      this.error = 'Complete all student fields before saving.';
      this.message = '';
      return;
    }
    this.message = 'Student details are ready to be saved.';
    this.error = '';
  }

  protected showManage(): void {
    this.activeTab = 'manage';
    this.loadStudents();
  }

  protected onManageClassChange(event: Event): void {
    this.selectedClassId.set(Number((event.target as HTMLSelectElement).value));
    this.loadStudents();
  }

  protected onManageSectionChange(event: Event): void {
    this.selectedSection.set((event.target as HTMLSelectElement).value);
    this.loadStudents();
  }

  private loadStudents(): void {
    this.loadingStudents.set(true);
    this.error = '';
    this.peopleService.getStudentsByClassAndSection(this.selectedClassId(), this.selectedSection()).subscribe({
      next: students => {
        this.students.set(students);
        this.loadingStudents.set(false);
      },
      error: () => {
        this.students.set([]);
        this.loadingStudents.set(false);
        this.error = 'Unable to load students for the selected class and section.';
      }
    });
  }
}
