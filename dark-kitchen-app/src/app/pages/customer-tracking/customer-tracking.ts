import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-customer-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-tracking.html',
  styleUrl: './customer-tracking.css'
})
export class CustomerTracking implements OnInit {
  pedido: any = { status: 'recebidos', endereco: 'Rua Tiradentes, 67' }; 
  etaText: string = 'Calculando...';
  addressEditMode: boolean = false;
  
  // A PROPRIEDADE QUE ESTÁ DANDO ERRO DEVE ESTAR AQUI:
  mapaInterativoUrl!: SafeResourceUrl;

  constructor(
    public orderService: OrderService, 
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.orderService.pedidoAtual$.subscribe(dadosAtualizados => {
      this.pedido = dadosAtualizados;
      this.atualizarCronometro(this.pedido.tempoEstimadoMinutos);
      this.atualizarMapa(this.pedido.endereco);
      this.cdr.detectChanges(); 
    });
  }

  atualizarMapa(endereco: string) {
    const busca = encodeURIComponent(endereco + ', São Paulo');
    // URL formatada para embed do Google
    const urlNua = `https://www.google.com/maps?q=${busca}&output=embed`;
    this.mapaInterativoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlNua);
  }

  getNivelStatus(status: string): number {
    const niveis = ['recebidos', 'preparacao', 'prontos', 'caminho', 'entregues'];
    return niveis.indexOf(status);
  }

  atualizarCronometro(minutos: number) { this.etaText = `${minutos} a ${minutos + 10} min`; }
  
  toggleAddressEdit() { this.addressEditMode = !this.addressEditMode; }
  
  saveAddress(rua: string, numero: string, bairro: string, regiao: string, cep: string, obs: string) { 
  this.pedido.rua = rua;
  this.pedido.numero = numero;
  this.pedido.bairro = bairro;
  this.pedido.regiao = regiao;
  this.pedido.cep = cep;
  this.pedido.obs = obs;
  
  // Atualiza no localStorage também
  localStorage.setItem('dk_pedido_1234', JSON.stringify(this.pedido));
  
  this.addressEditMode = false; 
}
  
  confirmDelivery(btnElement: HTMLElement) { 
    btnElement.classList.add('confirmed');
    btnElement.innerHTML = '✔ Entrega Finalizada!';
    this.orderService.atualizarStatus('entregues');
  }
}