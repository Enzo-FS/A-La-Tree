import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppStateService } from '../../../core/services/app-state.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-bottom-nav">
      
      <div class="nav-item" [class.active]="active === 'home'" (click)="irPara('/home')">
        <div class="icon-space">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
        <span class="nav-label">Início</span>
      </div>

      <div class="nav-item" [class.active]="active === 'explore'" (click)="irPara('/explorar')">
        <div class="icon-space">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <span class="nav-label">Menu</span>
      </div>

      <div class="nav-item center-nav">
        <button type="button" class="nav-center-btn" (click)="acaoBotaoCentral()">
          🍽️ 
          @if (state.cart().length > 0) {
            <span class="cart-badge">{{ state.cart().length }}</span>
          }
        </button>
      </div>

      <div class="nav-item" [class.active]="active === 'orders'" (click)="irPara('/meus-pedidos')">
        <div class="icon-space">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <span class="nav-label">Pedidos</span>
      </div>

      <div class="nav-item" [class.active]="active === 'profile'" (click)="irPara(state.user() ? '/perfil' : '/login')">
        <div class="icon-space">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <span class="nav-label">Perfil</span>
      </div>

    </div>
  `
})
export class BottomNavComponent {
  @Input() active: string = 'home';
  
  public state = inject(AppStateService);
  private router = inject(Router);

  irPara(rota: string) {
    if (!rota) return;
    this.router.navigate([rota]);
  }

  // Lógica da Trava do Carrinho Vazio
  acaoBotaoCentral() {
    if (this.state.cart().length > 0) {
      this.irPara('/pagamento');
    } else {
      alert('Nenhum item adicionado no momento.');
    }
  }
}