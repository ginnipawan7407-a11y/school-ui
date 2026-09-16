import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-teachers',
  imports: [RouterLink],
  templateUrl: './admin-teachers.component.html',
  styleUrl: './admin-people-management.css'
})
export class AdminTeachersComponent {
  protected readonly fields = ['empId', 'email', 'mobile', 'address', 'specialization', 'qualification', 'experience', 'joiningDate'];
  protected readonly form: Record<string, string> = {};
  protected activeTab: 'add' | 'manage' = 'add';
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
}
