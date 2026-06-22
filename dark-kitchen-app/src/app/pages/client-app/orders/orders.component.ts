import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state.service';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, BottomNavComponent],
  template: `
    <div class="orders-screen">
      <div class="top-bar">
        <button class="icon-btn" (click)="irPara('/home')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span class="top-bar-title">Carrinho</span>
        <div style="width:2.2rem"></div>
      </div>

      <div class="orders-list">
        <ng-container *ngIf="state.cart().length > 0; else emptyCart">
          <div class="cart-item" *ngFor="let item of state.cart()">
            <div class="cart-img" [style.background-image]="'url(' + item.food.img + ')'"></div>
            <div class="cart-info">
              <div class="cart-name">{{ item.food.name }}</div>
              <div class="cart-price">R$ {{ item.food.price }},00</div>
              <div class="cart-qty">
                <button class="qty-btn" (click)="state.adjustQty(item.food.id, -1)">-</button>
                <span class="qty-num">{{ item.qty }}</span>
                <button class="qty-btn plus" (click)="state.adjustQty(item.food.id, 1)">+</button>
              </div>
            </div>
            <button class="cart-del" (click)="state.removeItem(item.food.id)">🗑️</button>
          </div>
        </ng-container>

        <ng-template #emptyCart>
          <div class="cart-empty">
            <span>🛒</span>
            <p>Seu carrinho está vazio.</p>
            <button class="btn btn-outline" style="width:auto;padding:0.65rem 1.5rem;font-size:0.8rem;margin-top:0.5rem" (click)="irPara('/explorar')">Explorar Cardápio</button>
          </div>
        </ng-template>
      </div>

      <div class="order-footer" *ngIf="state.cart().length > 0">
        <div class="total-row">
          <span>Subtotal</span>
          <span>R$ {{ state.cartTotal() }},00</span>
        </div>
        <button class="btn btn-primary" (click)="irPara('/pagamento')">Avançar para Pagamento →</button>
      </div>

      <app-bottom-nav active="orders"></app-bottom-nav>
    </div>
  `,
  styles: [`
    .orders-screen { background: var(--bg); min-height: 100vh; display: flex; flex-direction: column; }
    .orders-list { flex: 1; padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.65rem; overflow-y: auto; padding-bottom: 11rem; }
    .cart-item { background: var(--white); border-radius: 1rem; display: flex; align-items: center; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .cart-img { width: 5rem; height: 5rem; background-size: cover; background-position: center; flex-shrink: 0; }
    .cart-info { flex: 1; padding: 0.65rem 0.75rem; min-width: 0; }
    .cart-name { font-size: 0.8rem; font-weight: 600; color: var(--gray-800); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cart-price { font-size: 0.7rem; color: var(--gray-400); margin-top: 2px; }
    .cart-qty { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
    .qty-btn { width: 1.4rem; height: 1.4rem; border-radius: 4px; border: none; background: var(--gray-100); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
    .qty-num { font-size: 0.85rem; font-weight: 700; color: var(--orange); width: 1.25rem; text-align: center; }
    .qty-btn.plus { background: var(--orange); color: #fff; }
    .cart-del { margin-right: 0.75rem; width: 2.1rem; height: 2.1rem; border-radius: 0.65rem; background: var(--red); border: none; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; flex-shrink: 0; font-size: 1rem; }
    .cart-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 6rem 0; }
    .cart-empty span { font-size: 4rem; }
    .cart-empty p { font-size: 0.85rem; font-weight: 500; color: var(--gray-400); }
    .order-footer { position: fixed; bottom: 4.5rem; left: 0; right: 0; max-width: 430px; margin: 0 auto; padding: 0 1.25rem 0.75rem; z-index: 40; }
    .total-row { background: var(--white); border-radius: 1rem; padding: 0.85rem 1rem; box-shadow: 0 4px 16px rgba(0,0,0,0.08); display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .total-row span:first-child { font-size: 0.82rem; color: var(--gray-500); font-weight: 500; }
    .total-row span:last-child { font-size: 0.95rem; font-weight: 700; color: var(--gray-800); }
  `],
})
export class OrdersComponent {
  constructor(public state: AppStateService) {}

  private router = inject(Router);
  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}
