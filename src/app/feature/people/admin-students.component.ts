import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-students',
  imports: [RouterLink],
  templateUrl: './admin-students.component.html',
  styleUrl: './admin-people-management.css'
})
export class AdminStudentsComponent {
  protected readonly fields = ['name', 'rollNumber', 'admissionNumber', 'address', 'fatherName', 'motherName', 'parentMobile', 'className', 'section', 'email'];
  protected readonly form: Record<string, string> = {};
  protected activeTab: 'add' | 'manage' = 'add';
  protected message = '';
  protected error = '';

  protected labelFor(field: string): string {
    return { rollNumber: 'Roll no', admissionNumber: 'Admission no', className: 'Class', parentMobile: 'Parent mobile' }[field] ?? field;
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
}
