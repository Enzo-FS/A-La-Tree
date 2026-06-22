import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state.service';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { PedidoService } from '../../../core/services/pedido.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, BottomNavComponent],
  template: `
    <div class="profile-screen">
      <div class="top-bar">
        <button class="icon-btn" (click)="irPara('/home')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span class="top-bar-title">Minha Conta</span>
        <div style="width:2.2rem"></div>
      </div>

      <!-- Card do usuário logado -->
      <div class="profile-card" *ngIf="!state.isGuest() && state.user() as u">
        <div class="profile-info">
          <h3>{{ u.name }}</h3>
          <p>{{ u.email }}</p>
          <small>{{ u.endereco || 'Nenhum endereço cadastrado' }}</small>
          <small *ngIf="u.telefone" style="margin-top:2px">📞 {{ u.telefone }}</small>
        </div>
        <div class="profile-avatar">👤</div>
      </div>

      <!-- Card do visitante -->
      <div class="profile-guest-card" *ngIf="state.isGuest()">
        <h3>Você está como Visitante</h3>
        <p>Crie uma conta ou faça login para acompanhar pedidos históricos e salvar endereços.</p>
        <button class="btn btn-primary" (click)="irPara('/login')">Fazer Login / Cadastrar</button>
      </div>

      <!-- Toggle de notificações -->
      <div class="notif-row">
        <div class="notif-label"><span>🔔</span> Receber alertas do dia</div>
        <button class="toggle" [style.background]="state.notifOn() ? 'var(--orange)' : 'var(--gray-200)'" (click)="state.notifOn.set(!state.notifOn())">
          <div class="toggle-thumb" [style.transform]="state.notifOn() ? 'translateX(1.4rem)' : 'translateX(0px)'"></div>
        </button>
      </div>

      <!-- Meus Pedidos (usuário logado) -->
      <div *ngIf="!state.isGuest() && state.user()">
        <div class="pedidos-section">
          <div class="pedidos-header">
            <span>📦 Meus Pedidos</span>
            <button class="reload-btn" (click)="carregarPedidos()">↻ Atualizar</button>
          </div>

          <div *ngIf="carregandoPedidos" class="pedidos-loading">Carregando pedidos...</div>

          <div *ngIf="!carregandoPedidos && state.meusPedidos().length === 0" class="pedidos-empty">
            Nenhum pedido encontrado.
          </div>

          <div class="pedido-item" *ngFor="let p of state.meusPedidos()">
            <div class="pedido-item-top">
              <span class="pedido-date">{{ formatarData(p.createdAt) }}</span>
              <span class="pedido-status" [class]="'status-' + p.status">
                {{ pedidoService.labelStatus(p.status) }}
              </span>
            </div>
            <div class="pedido-item-bottom">
              <span class="pedido-itens">{{ p.itens?.length ?? 0 }} item(ns)</span>
              <span class="pedido-total">R$ {{ p.valorTotal }},00</span>
            </div>
          </div>
        </div>

        <div class="menu-list">
          <button class="menu-item"><span>Meus Cupons</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
          <button class="menu-item"><span>Endereços Salvos</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
          <button class="menu-item danger" (click)="logout()"><span>Sair</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>

      <div *ngIf="state.isGuest()">
        <div class="menu-list" style="margin-top:0.85rem">
          <button class="menu-item"><span>Contate-nos</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>

      <app-bottom-nav active="profile"></app-bottom-nav>
    </div>
  `,
  styles: [`
    .profile-screen { background: var(--bg); min-height: 100vh; padding-bottom: 6rem; display: flex; flex-direction: column; }
    .profile-card { margin: 0.75rem 1.25rem 0; border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; background: var(--orange); }
    .profile-info { flex: 1; min-width: 0; }
    .profile-info h3 { font-size: 1.2rem; font-weight: 700; color: #fff; }
    .profile-info p { font-size: 0.78rem; color: rgba(255,255,255,0.8); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .profile-info small { font-size: 0.7rem; color: rgba(255,255,255,0.65); display: block; margin-top: 4px; }
    .profile-avatar { width: 3.25rem; height: 3.25rem; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 2rem; flex-shrink: 0; }
    .profile-guest-card { background: linear-gradient(135deg,#FFF3E0,#FFE8C8); border-radius: 1.25rem; padding: 1.25rem; margin: 0.75rem 1.25rem 0; border: 2px dashed #F08B19; text-align: center; }
    .profile-guest-card h3 { font-size: 1rem; font-weight: 700; color: var(--orange-dark); margin-bottom: 0.4rem; }
    .profile-guest-card p { font-size: 0.78rem; color: #7B4A00; margin-bottom: 1rem; }
    .notif-row { background: var(--white); border-radius: 1rem; padding: 0.85rem 1rem; display: flex; align-items: center; justify-content: space-between; margin: 0.65rem 1.25rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .notif-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; font-weight: 500; color: var(--gray-800); }
    .toggle { width: 2.75rem; height: 1.35rem; border-radius: 99px; border: none; cursor: pointer; position: relative; transition: background 0.2s; }
    .toggle-thumb { position: absolute; top: 2px; left: 0; width: 1rem; height: 1rem; background: #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.25); transition: transform 0.2s; }
    .pedidos-section { background: var(--white); border-radius: 1rem; margin: 0.65rem 1.25rem 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .pedidos-header { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem 0.5rem; }
    .pedidos-header span { font-size: 0.82rem; font-weight: 600; color: var(--gray-800); }
    .reload-btn { background: none; border: none; font-size: 0.75rem; color: var(--orange); cursor: pointer; font-family: 'Poppins', sans-serif; }
    .pedidos-loading, .pedidos-empty { font-size: 0.78rem; color: var(--gray-400); text-align: center; padding: 1rem; }
    .pedido-item { padding: 0.75rem 1rem; border-top: 1px solid #f3f3f3; }
    .pedido-item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
    .pedido-date { font-size: 0.72rem; color: var(--gray-400); }
    .pedido-status { font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 99px; }
    .status-recebido { background: #FFF3E0; color: #E65100; }
    .status-preparando { background: #FFF8E1; color: #F57F17; }
    .status-saiu_para_entrega { background: #E3F2FD; color: #0D47A1; }
    .status-entregue { background: #E8F5E9; color: #1B5E20; }
    .pedido-item-bottom { display: flex; justify-content: space-between; }
    .pedido-itens { font-size: 0.75rem; color: var(--gray-500); }
    .pedido-total { font-size: 0.78rem; font-weight: 700; color: var(--orange); }
    .menu-list { background: var(--white); border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin: 0.85rem 1.25rem 0; }
    .menu-item { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 1rem; border: none; background: var(--white); cursor: pointer; border-bottom: 1px solid #f3f3f3; font-family: 'Poppins', sans-serif; text-align: left; }
    .menu-item:last-child { border-bottom: none; }
    .menu-item:active { background: #f9f9f9; }
    .menu-item span { font-size: 0.82rem; font-weight: 500; color: var(--gray-800); }
    .menu-item.danger span { color: var(--red); }
    .menu-item svg { width: 0.9rem; height: 0.9rem; color: #ccc; }
    .menu-item.danger svg { color: #fca5a5; }
  `],
})
export class ProfileComponent implements OnInit {
  carregandoPedidos = false;

  constructor(
    public state: AppStateService,
    public pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    if (!this.state.isGuest() && this.state.user()) {
      this.carregarPedidos();
    }
  }

  async carregarPedidos(): Promise<void> {
    this.carregandoPedidos = true;
    await this.state.carregarMeusPedidos();
    this.carregandoPedidos = false;
  }

  async logout(): Promise<void> {
    await this.state.doLogout();
  }

  formatarData(ts: any): string {
    if (!ts) return '—';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return '—';
    }
  }
  private router = inject(Router);
  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}
