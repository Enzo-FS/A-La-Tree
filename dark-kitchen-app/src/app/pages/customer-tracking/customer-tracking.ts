import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service'; // Caminho corrigido com ../../

@Component({
  selector: 'app-customer-tracking',
  standalone: true,
  templateUrl: './customer-tracking.html',
  styleUrl: './customer-tracking.css'
})
export class CustomerTracking implements OnInit {
  orderState: any;
  addressEditMode: boolean = false;

  // Construtor limpo, sem letras perdidas
  constructor(public orderService: OrderService) {
    this.orderState = this.orderService.orderState;
  }

  ngOnInit(): void {
    this.initETA();
  }

  initETA() {
    let total = 19 * 60 + 30;
    
    const tick = () => {
      if (total <= 0) { 
        this.orderState.etaText = 'Chegando!'; 
        return; 
      }
      const m = Math.floor(total / 60);
      const s = total % 60;
      this.orderState.etaText = `${m}:${String(s).padStart(2, '0')} min`;
      total--;
      setTimeout(tick, 1000);
    };
    tick();
  }

  toggleAddressEdit() {
    this.addressEditMode = !this.addressEditMode;
  }

  saveAddress() {
    this.addressEditMode = false;
  }

  confirmDelivery(btnElement: HTMLElement) {
    btnElement.classList.add('confirmed');
    btnElement.innerHTML = 'Entrega confirmada!';
  }
}