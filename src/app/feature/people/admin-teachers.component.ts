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
  protected readonly fields = ['name', 'gender', 'username', 'empId', 'email', 'mobile', 'address', 'specialization', 'qualification', 'experience', 'joiningDate'];
  protected readonly form: Record<string, string> = {};
  protected activeTab: 'add' | 'manage' = 'add';
  protected readonly teachers = signal<AdminTeacher[]>([]);
  protected readonly loadingTeachers = signal(false);
  protected editingTeacherId: number | null = null;
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
    if (this.editingTeacherId === null) {
      this.message = 'Teacher details are ready to be saved.';
      this.error = '';
      return;
    }

    const teacher: AdminTeacher = {
      id: this.editingTeacherId,
      name: this.form['name'],
      gender: this.form['gender'],
      email: this.form['email'],
      username: this.form['username'],
      employeeId: this.form['empId'],
      qualification: this.form['qualification'],
      specialization: this.form['specialization'],
      joiningDate: this.form['joiningDate'],
      experienceYears: Number(this.form['experience']),
      address: this.form['address'],
      phone: this.form['mobile']
    };
    this.peopleService.updateTeacher(teacher).subscribe({
      next: () => {
        this.message = 'Teacher details updated successfully.';
        this.error = '';
        this.editingTeacherId = null;
        this.loadTeachers();
      },
      error: () => {
        this.error = 'Unable to update teacher details.';
        this.message = '';
      }
    });
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

  protected editTeacher(teacher: AdminTeacher): void {
    this.editingTeacherId = teacher.id;
    Object.assign(this.form, {
      name: teacher.name,
      gender: teacher.gender ?? '',
      username: teacher.username,
      empId: teacher.employeeId,
      email: teacher.email,
      mobile: teacher.phone,
      address: teacher.address,
      specialization: teacher.specialization,
      qualification: teacher.qualification,
      experience: String(teacher.experienceYears ?? teacher.experience ?? 0),
      joiningDate: (teacher.joiningDate || teacher.dateOfJoining || '').slice(0, 10)
    });
    this.activeTab = 'add';
    this.message = '';
    this.error = '';
  }
}
