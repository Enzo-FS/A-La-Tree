import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DatabaseService } from '../../core/services/database'; // Mantivemos para gerenciar a frota
import { PedidoService } from '../../core/services/pedido.service'; // O NOVO SERVIÇO REAL
import { Observable } from 'rxjs';

@Component({
  selector: 'app-store-manager',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './store-manager.html',
  styleUrl: './store-manager.css'
})
export class StoreManager implements OnInit {
  currentTab: string = 'recebidos';
  motoboys$: Observable<any[]>;
  pedidos: any[] = []; 
  listaMotoboys: any[] = [];

  // 1. Injetamos o serviço que conecta com o Firebase
  private pedidoService = inject(PedidoService);

  constructor(private dbService: DatabaseService) {
    // Mantém a lógica de buscar os motoboys da base
    this.motoboys$ = this.dbService.getMotoboys();
    this.motoboys$.subscribe(motos => this.listaMotoboys = motos);
  }

  // 2. Quando a tela abre, puxamos os dados REAIS
  async ngOnInit() {
    await this.carregarPedidos();
  }

  // Função para buscar os pedidos sempre atualizados
  async carregarPedidos() {
    try {
      this.pedidos = await this.pedidoService.listarPedidos();
    } catch (error) {
      console.error("Erro ao buscar pedidos reais do Firebase:", error);
    }
  }

  setTab(tabName: string) {
    this.currentTab = tabName;
  }

  // 3. Tradutor: Pega os status do Firebase e encaixa nas abas do seu HTML
  getPedidos(tabStatus: string) {
    let statusFirebase = tabStatus;
    if (tabStatus === 'recebidos') statusFirebase = 'recebido';
    if (tabStatus === 'preparacao') statusFirebase = 'preparando';
    if (tabStatus === 'caminho') statusFirebase = 'saiu_para_entrega';

    return this.pedidos.filter(p => p.status === statusFirebase);
  }

  // 4. Avança o pedido de verdade e salva no banco
  async avancarPedido(pedido: any, novoStatusHtml: string) {
    let statusFirebase = novoStatusHtml;
    
    // Tradutor do painel para o Firebase
    if (novoStatusHtml === 'preparacao') statusFirebase = 'preparando';
    if (novoStatusHtml === 'caminho') statusFirebase = 'saiu_para_entrega';
    if (novoStatusHtml === 'recebidos') statusFirebase = 'recebido';
    // Se for 'entregue', o statusFirebase já será 'entregue' corretamente!

    try {
      await this.pedidoService.atualizarStatusPedido(pedido.id, statusFirebase as any);
      await this.carregarPedidos(); 
      
      // 👇 A MÁGICA AQUI: Evita que a aba resete e fique em branco!
      if (statusFirebase === 'entregue') {
          alert('✅ Pedido entregue e finalizado com sucesso!');
          this.setTab('caminho'); // Fica na mesma aba (que agora mostrará a fila andando)
      } else {
          this.setTab(novoStatusHtml);  
      }
    } catch (e) {
      console.error("Erro ao atualizar o status do pedido no banco:", e);
    }
  }

  // 5. Atribuir Motoboy
  async atribuirMotoboy(pedido: any, nomeMoto: string) {
    if (!nomeMoto) {
      alert('Por favor, selecione um motoboy disponível na frota.');
      return;
    }

    try {
      // 👇 Agora a tela pede para o serviço fazer o trabalho sujo!
      await this.pedidoService.atribuirMotoboy(pedido.id, nomeMoto);

      // Atualiza a tela após salvar
      await this.carregarPedidos();
      this.setTab('caminho');
      alert(`O entregador ${nomeMoto} foi atribuído com sucesso!`);
      
    } catch (e) {
      console.error("Erro ao atribuir motoboy:", e);
      alert("Houve um erro ao tentar salvar o motoboy. Tente novamente.");
    }
  }

  cadastrarMotoboy(nome: string, modelo: string, placa: string, telefone: string) {
    if (!nome || !placa) {
      alert('Atenção: Nome e Placa são obrigatórios para o registro.');
      return;
    }
    this.dbService.addMotoboy({
      nome: nome, modeloMoto: modelo, placa: placa.toUpperCase(), telefone: telefone, ativo: true 
    }).then(() => {
      alert(`Sucesso! ${nome} foi adicionado à frota.`);
    }).catch(err => {
      console.error(err);
      alert('Ocorreu um erro ao salvar o motoboy.');
    });
  }

  resetarTeste() {
    alert('🔄 Você agora está conectado ao Banco de Dados Real! Pedidos não podem mais ser resetados, apenas avançados até a entrega.');
  }
}