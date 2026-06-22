import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 1. Importamos o Roteador oficial
import { AppStateService } from '../../../core/services/app-state.service';
import { Screen } from '../../../core/models/models';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="bottom-nav">
      <button class="nav-btn" [style.color]="active === 'home' ? 'var(--orange)' : 'var(--gray-400)'" (click)="irPara('/home')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
        <span>Menu</span>
      </button>

      <button class="nav-btn" [style.color]="active === 'explore' ? 'var(--orange)' : 'var(--gray-400)'" (click)="irPara('/explorar')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
        <span>Explorar</span>
      </button>

      <button class="nav-center-btn" (click)="irPara('/explorar')">🍽️</button>

      <button class="nav-btn" [style.color]="active === 'orders' ? 'var(--orange)' : 'var(--gray-400)'" (click)="irPara('/meus-pedidos')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <span>Pedido</span>
        <span class="cart-badge" *ngIf="state.cartCount() > 0">{{ state.cartCount() }}</span>
      </button>

      <button class="nav-btn" [style.color]="active === 'profile' ? 'var(--orange)' : 'var(--gray-400)'" (click)="irPara('/login')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Perfil</span>
      </button>
    </nav>
  `,
})
export class BottomNavComponent {
  @Input() active: Screen = 'home';
  
  // 2. Injetamos o Router do Angular
  private router = inject(Router);

  constructor(public state: AppStateService) {}

  // 3. Criamos a função que força o sistema a mudar a URL e carregar a tela
  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}