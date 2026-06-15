import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-tracking',
  standalone: true,
  templateUrl: './customer-tracking.html',
  styleUrl: './customer-tracking.css'
})
export class CustomerTracking implements OnInit {
  
  // Configuração inicial simulada (Igual ao seu script.js)
  orderState = {
    step: 2, 
    etaMinutes: 19,
    etaSeconds: 30
  };

  etaText: string = '19:30 min';
  addressEditMode: boolean = false;

  ngOnInit(): void {
    this.initETA();
  }

  // Lógica do cronômetro
  initETA() {
    let total = this.orderState.etaMinutes * 60 + this.orderState.etaSeconds;
    
    const tick = () => {
      if (total <= 0) { 
        this.etaText = 'Chegando!'; 
        return; 
      }
      const m = Math.floor(total / 60);
      const s = total % 60;
      this.etaText = `${m}:${String(s).padStart(2, '0')} min`;
      total--;
      setTimeout(tick, 1000);
    };
    tick();
  }

  // --- Funções de Botões no HTML ---
  
  toggleAddressEdit() {
    this.addressEditMode = !this.addressEditMode;
  }

  saveAddress(street: string, hood: string, city: string, cep: string) {
    // No futuro, isso salvará no Firebase
    this.addressEditMode = false;
    alert('Endereço atualizado com sucesso!');
  }

  confirmDelivery(btnElement: HTMLElement) {
    btnElement.classList.add('confirmed');
    btnElement.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20"><path d="M4 10l4.5 4.5L16 5.5" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      Entrega confirmada!
    `;
    alert('Obrigado! Bom apetite 🍽️');
  }
}