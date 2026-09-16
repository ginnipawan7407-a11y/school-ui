import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { AuthSessionService } from '../../core/auth/auth-session.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private readonly authSession = inject(AuthSessionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly isProfileMenuOpen = signal(false);
  protected readonly today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  }).format(new Date());
  protected readonly isAuthenticated = computed(() => this.authSession.isAuthenticatedState());

  protected toggleProfileMenu(): void {
    this.isProfileMenuOpen.update(isOpen => !isOpen);
  }

  protected logout(): void {
    this.authService.logout();
    this.isProfileMenuOpen.set(false);
    void this.router.navigateByUrl('/login');
  }
}
