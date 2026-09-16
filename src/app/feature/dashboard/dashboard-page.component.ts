import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { DashboardService } from './dashboard.service';
import { FALLBACK_DASHBOARD_DATA, Role } from '../../common/model/dashboard.models';
import { WelcomeComponent } from '../../common/welcome/welcome.component';
import { WorkspaceComponent } from '../../common/workspace/workspace.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [WelcomeComponent, WorkspaceComponent],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly role = signal<Role>(this.getRole(this.route.snapshot.queryParamMap.get('role')));
  protected readonly dashboard = toSignal(this.dashboardService.getDashboardData(), {
    initialValue: FALLBACK_DASHBOARD_DATA
  });

  protected selectRole(role: Role): void {
    this.role.set(role);
    void this.router.navigate([], {
      queryParams: { role },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private getRole(value: string | null): Role {
    switch (value?.toLowerCase()) {
      case 'student': return 'Student';
      case 'admin': return 'Admin';
      default: return 'Teacher';
    }
  }
}
