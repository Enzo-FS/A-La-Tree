import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-customer-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-tracking.html',
  styleUrl: './customer-tracking.css'
})
export class CustomerTracking implements OnInit {
  pedido: any = { status: 'recebidos' }; 
  etaText: string = 'Calculando...';
  addressEditMode: boolean = false;

  // INJETAMOS O DETECTOR DE MUDANÇAS AQUI
  constructor(public orderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.orderService.pedidoAtual$.subscribe(dadosAtualizados => {
      this.pedido = dadosAtualizados;
      this.atualizarCronometro(this.pedido.tempoEstimadoMinutos);
      
      // FORÇA A TELA A ATUALIZAR SEM PRECISAR DE F5
      this.cdr.detectChanges(); 
    });
  }

  getNivelStatus(status: string): number {
    const niveis = ['recebidos', 'preparacao', 'prontos', 'caminho', 'entregues'];
    return niveis.indexOf(status);
  }

  atualizarCronometro(minutos: number) { this.etaText = `${minutos} a ${minutos + 10} min`; }
  toggleAddressEdit() { this.addressEditMode = !this.addressEditMode; }
  saveAddress() { this.addressEditMode = false; }
  confirmDelivery(btnElement: HTMLElement) { 
    btnElement.classList.add('confirmed');
    btnElement.innerHTML = 'Entrega confirmada!';
  }
}