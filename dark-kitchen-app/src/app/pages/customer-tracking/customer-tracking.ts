import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router'; // 👈 IMPORTAÇÃO NOVA
import { AppStateService } from '../../core/services/app-state.service';
import { PedidoService } from '../../core/services/pedido.service';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore'; 

@Component({
  selector: 'app-customer-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-tracking.html',
  styleUrl: './customer-tracking.css'
})
export class CustomerTracking implements OnInit, OnDestroy {
  pedidoReal: any = null; 
  etaText: string = 'Calculando...';
  addressEditMode: boolean = false;
  mapaInterativoUrl!: SafeResourceUrl;

  private pedidoService = inject(PedidoService);
  public state = inject(AppStateService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);
  private firestore = inject(Firestore); 
  private zone = inject(NgZone); 
  private route = inject(ActivatedRoute); // 👈 INJEÇÃO DA ROTA

  private escutaDoFirebase: any; 

  async ngOnInit() {
    // Verifica se a URL trouxe um ID específico (ex: /pedido/abc123D)
    const pedidoId = this.route.snapshot.paramMap.get('id');
    
    if (pedidoId) {
      await this.carregarPedidoEspecifico(pedidoId);
    } else {
      await this.carregarMeuUltimoPedido();
    }
  }

  // 1. CARREGA UM PEDIDO ESPECÍFICO DO HISTÓRICO
  async carregarPedidoEspecifico(id: string) {
    try {
      const pedidoRef = doc(this.firestore, 'pedidos', id);
      
      // Conecta o radar direto no ID que veio do histórico
      this.escutaDoFirebase = onSnapshot(pedidoRef, (docSnap) => {
        if (docSnap.exists()) {
          this.zone.run(() => {
            this.pedidoReal = { id: docSnap.id, ...docSnap.data() };
            this.atualizarInterface();
          });
        }
      });
    } catch (error) {
      console.error("Erro ao buscar pedido específico:", error);
    }
  }

  // 2. CARREGA O ÚLTIMO (Lógica original mantida intacta)
  async carregarMeuUltimoPedido() {
    const user = this.state.user();
    if (!user || !user.id) return;

    try {
      const pedidos = await this.pedidoService.buscarPedidosPorUsuario(user.id);
      if (pedidos && pedidos.length > 0) {
        const pedidosMaisNovos = pedidos.reverse(); 
        let pedidoAtivo = pedidosMaisNovos.find((p: any) => p.status !== 'entregue');
        
        let pedidoAlvo = pedidoAtivo || pedidosMaisNovos[0];
        
        // 👇 A CORREÇÃO: Essa linha acalma o TypeScript, garantindo que o ID existe!
        if (pedidoAlvo && pedidoAlvo.id) {
          await this.carregarPedidoEspecifico(pedidoAlvo.id);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar último pedido:", error);
    }
  }

  // ... (TODO O RESTO DO CÓDIGO CONTINUA EXATAMENTE IGUAL)
  atualizarInterface() {
    this.atualizarCronometro(this.pedidoReal?.status || '');
    this.atualizarMapa(this.pedidoReal?.enderecoEntrega || '');
  }

  atualizarMapa(endereco: string) {
    if (!endereco) return;
    const busca = encodeURIComponent(endereco + ', São Paulo');
    const urlNua = `https://maps.google.com/maps?q=${busca}&output=embed`;
    this.mapaInterativoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlNua);
  }

  getNivelStatus(status: string): number {
    if (!status) return -1;
    if (status === 'recebido') return 0;
    if (status === 'preparando') return 1;
    if (status === 'saiu_para_entrega') return 3; 
    if (status === 'entregue') return 4;
    return 0;
  }

  atualizarCronometro(status: string) { 
    if (status === 'recebido') this.etaText = '40 a 50 min';
    else if (status === 'preparando') this.etaText = '20 a 30 min';
    else if (status === 'saiu_para_entrega') this.etaText = '10 a 15 min';
    else this.etaText = 'Concluído';
  }
  
  toggleAddressEdit() { this.addressEditMode = !this.addressEditMode; }
  
  saveAddress(novoEndereco: string) { 
    if(this.pedidoReal) {
      this.pedidoReal.enderecoEntrega = novoEndereco;
      this.addressEditMode = false; 
    }
  }
  
  async confirmDelivery(btnElement: HTMLElement) { 
    if (!this.pedidoReal) return;
    btnElement.classList.add('confirmed');
    btnElement.innerHTML = '✔ Entrega Finalizada!';
    await this.pedidoService.atualizarStatusPedido(this.pedidoReal.id, 'entregue' as any);
  }

  ngOnDestroy() {
    if (this.escutaDoFirebase) {
      this.escutaDoFirebase();
    }
  }
}