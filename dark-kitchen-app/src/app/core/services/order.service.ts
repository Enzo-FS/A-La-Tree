import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // O 'root' garante que as duas telas usem exatamente a mesma memória
})
export class OrderService {
  // O estado global do nosso pedido
  orderState = {
    step: 2, 
    etaText: '19:30 min',
    statusName: 'Pedido Pronto'
  };

  // Função que a Loja vai usar para mudar o status
  changeOrderStatus(stepIndex: number, statusText: string) {
    this.orderState.step = stepIndex;
    this.orderState.statusName = statusText;
  }
}