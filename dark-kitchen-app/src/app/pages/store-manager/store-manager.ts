import { Component } from '@angular/core';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-store-manager',
  standalone: true,
  templateUrl: './store-manager.html',
  styleUrl: './store-manager.css'
})
export class StoreManager {
  // Define a aba inicial
  currentTab: string = 'recebidos';

  constructor(public orderService: OrderService) {}

  // Função para trocar as abas do menu
  setTab(tabName: string) {
    this.currentTab = tabName;
  }

  // Função que atualiza o app do cliente e já pula para a próxima aba na loja
  processOrder(stepIndex: number, statusText: string, nextTab: string) {
    this.orderService.changeOrderStatus(stepIndex, statusText);
    this.setTab(nextTab);
  }
}