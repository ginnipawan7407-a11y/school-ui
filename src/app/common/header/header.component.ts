import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthSessionService } from '../../core/auth/auth-session.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private readonly authSession = inject(AuthSessionService);
  protected readonly today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  }).format(new Date());
  protected readonly isAuthenticated = computed(() => this.authSession.isAuthenticatedState());
}
