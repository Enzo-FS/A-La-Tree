import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-driver-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-panel.html',
  styleUrl: './driver-panel.css'
})
export class DriverPanel implements OnInit {
  private orderService = inject(OrderService);
  pedido: any = null;

  ngOnInit() {
    // Escuta o cérebro global do app para manter os dados síncronos
    this.orderService.pedidoAtual$.subscribe(dados => {
      this.pedido = dados;
    });
  }

  iniciarEntrega() {
    this.orderService.atualizarStatus('caminho');
  }

  concluirEntrega() {
    this.orderService.atualizarStatus('entregues');
  }
}