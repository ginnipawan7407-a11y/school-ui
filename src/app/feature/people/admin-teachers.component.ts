import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminTeacher, PeopleService } from './people.service';

@Component({
  selector: 'app-admin-teachers',
  imports: [RouterLink],
  templateUrl: './admin-teachers.component.html',
  styleUrl: './admin-people-management.css'
})
export class AdminTeachersComponent {
  private readonly peopleService = inject(PeopleService);
  protected readonly fields = ['empId', 'email', 'mobile', 'address', 'specialization', 'qualification', 'experience', 'joiningDate'];
  protected readonly form: Record<string, string> = {};
  protected activeTab: 'add' | 'manage' = 'add';
  protected readonly teachers = signal<AdminTeacher[]>([]);
  protected readonly loadingTeachers = signal(false);
  protected message = '';
  protected error = '';

  protected updateField(field: string, event: Event): void {
    this.form[field] = (event.target as HTMLInputElement).value;
  }

  protected save(): void {
    if (this.fields.some(field => !this.form[field]?.trim())) {
      this.error = 'Complete all teacher fields before saving.';
      this.message = '';
      return;
    }
    this.message = 'Teacher details are ready to be saved.';
    this.error = '';
  }

  protected showManage(): void {
    this.activeTab = 'manage';
    this.loadTeachers();
  }

  private loadTeachers(): void {
    this.loadingTeachers.set(true);
    this.error = '';
    this.peopleService.getAdminTeachers().subscribe({
      next: teachers => {
        this.teachers.set(teachers);
        this.loadingTeachers.set(false);
      },
      error: () => {
        this.teachers.set([]);
        this.loadingTeachers.set(false);
        this.error = 'Unable to load teacher records.';
      }
    });
  }
}
