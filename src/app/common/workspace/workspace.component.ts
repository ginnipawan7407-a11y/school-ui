import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MenuItem, Role } from '../model/dashboard.models';

@Component({
  selector: 'app-workspace',
  imports: [RouterLink],
  templateUrl: './workspace.component.html'
})
export class WorkspaceComponent {
  @Input({ required: true }) role!: Role;
  @Input({ required: true }) menus!: Record<Role, MenuItem[]>;
  @Output() roleChange = new EventEmitter<Role>();

  protected readonly roles: Role[] = ['Teacher', 'Student', 'Admin'];

  protected selectRole(role: Role): void {
    this.roleChange.emit(role);
  }
}
