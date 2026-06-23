import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import { AppStateService } from '../../../core/services/app-state.service';
// import { BottomNavComponent } from '../bottom-nav/bottom-nav.component'; // Descomente se usar a navbar

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule], // Adicione o BottomNavComponent aqui se for usar
  template: `
    <div class="history-page">
      <header class="history-header">
        <h2>Meus Pedidos</h2>
        <p>Acompanhe o status e histórico</p>
      </header>

      <div class="orders-list">
        @if (carregando) {
          <div class="loading-state">Buscando seus pedidos...</div>
        } @else if (meusPedidos.length === 0) {
          <div class="empty-state">
            <div class="empty-icon">🍽️</div>
            <p>Você ainda não fez nenhum pedido.</p>
            <button class="btn-explore" (click)="irPara('/explorar')">Explorar Cardápio</button>
          </div>
        } @else {
          @for (pedido of meusPedidos; track pedido.id) {
            <div class="order-card" (click)="abrirDetalhes(pedido.id)">
              
              <div class="card-top">
                <span class="order-id">#{{ pedido.id | slice:0:6 }}</span>
                <span class="order-status" [class.done]="pedido.status === 'entregue'">
                  {{ traduzirStatus(pedido.status) }}
                </span>
              </div>
              
              <div class="card-mid">
                <div class="order-items-preview">
                  @for (item of pedido.itens | slice:0:2; track $index) {
                    <p>{{ item.qty || item.quantidade || 1 }}x {{ item.food?.name || item.nome || 'Produto' }}</p>
                  }
                  @if (pedido.itens?.length > 2) {
                    <p class="more-items">+ {{ pedido.itens.length - 2 }} itens</p>
                  }
                </div>
                <div class="order-price">
                  <span>Total</span>
                  <strong>R$ {{ pedido.valorTotal || '0,00' }}</strong>
                </div>
              </div>
              
              <div class="card-bottom">
                <span>Ver detalhes do pedido ➔</span>
              </div>

            </div>
          }
        }
      </div>
      
      </div>
  `,
  styles: [`
    .history-page { min-height: 100vh; background: var(--bg, #F5F5F7); padding: 2rem 1.5rem 6rem; max-width: 430px; margin: 0 auto; display: flex; flex-direction: column; }
    .history-header { margin-bottom: 2rem; }
    .history-header h2 { font-size: 1.8rem; font-weight: 800; color: var(--text, #1A1A1A); }
    .history-header p { font-size: 0.9rem; color: var(--text-soft, #555); margin-top: 4px; }
    
    .orders-list { display: flex; flex-direction: column; gap: 1rem; }
    
    .order-card { background: var(--card, #FFF); border-radius: 16px; padding: 1.25rem; box-shadow: 0 4px 12px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.03); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .order-card:active { transform: scale(0.97); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    
    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px dashed #E5E7EB; }
    .order-id { font-family: monospace; font-size: 0.95rem; font-weight: 700; color: var(--gray-dark, #6B6B6B); }
    .order-status { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 4px 8px; border-radius: 6px; background: var(--orange-lite, #FFF3E0); color: var(--orange, #E27E0C); }
    .order-status.done { background: #DCFCE7; color: #166534; }
    
    .card-mid { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1rem; }
    .order-items-preview p { font-size: 0.85rem; color: var(--text, #1A1A1A); font-weight: 500; line-height: 1.4; }
    .more-items { color: var(--gray-dark, #6B6B6B) !important; font-size: 0.75rem !important; margin-top: 4px; }
    
    .order-price { display: flex; flex-direction: column; align-items: flex-end; }
    .order-price span { font-size: 0.75rem; color: var(--text-soft, #555); }
    .order-price strong { font-size: 1.1rem; font-weight: 800; color: var(--text, #1A1A1A); }
    
    .card-bottom { text-align: center; font-size: 0.8rem; font-weight: 700; color: var(--orange, #E27E0C); }
    
    .loading-state, .empty-state { text-align: center; padding: 3rem 1rem; color: var(--text-soft, #555); }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
    .btn-explore { margin-top: 1.5rem; padding: 0.8rem 1.5rem; background: var(--orange, #E27E0C); color: #FFF; border-radius: 8px; font-weight: 700; }
  `]
})
export class OrdersComponent implements OnInit {
  meusPedidos: any[] = [];
  carregando = true;

  private pedidoService = inject(PedidoService);
  private state = inject(AppStateService);
  private router = inject(Router);

  async ngOnInit() {
    const user = this.state.user();
    if (user?.id) {
      try {
        // Busca os pedidos e inverte para o mais recente ficar no topo da lista
        const pedidos = await this.pedidoService.buscarPedidosPorUsuario(user.id);
        this.meusPedidos = pedidos.reverse();
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      }
    }
    this.carregando = false;
  }

  traduzirStatus(status: string): string {
    if (status === 'recebido') return 'Aguardando';
    if (status === 'preparando') return 'Preparando';
    if (status === 'saiu_para_entrega') return 'A Caminho';
    if (status === 'entregue') return 'Entregue';
    return status;
  }

  // 👇 AQUI ESTÁ A MÁGICA DE NAVEGAÇÃO
  abrirDetalhes(pedidoId: string) {
    this.router.navigate(['/pedido', pedidoId]);
  }

  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}