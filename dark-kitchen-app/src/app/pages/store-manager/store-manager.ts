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
    // Traduz o que o botão clicou para a linguagem do banco
    let statusFirebase = novoStatusHtml;
    if (novoStatusHtml === 'preparacao') statusFirebase = 'preparando';
    if (novoStatusHtml === 'caminho') statusFirebase = 'saiu_para_entrega';
    if (novoStatusHtml === 'entregue') statusFirebase = 'entregue';
    if (novoStatusHtml === 'recebidos') statusFirebase = 'recebido';

    try {
      await this.pedidoService.atualizarStatusPedido(pedido.id, statusFirebase as any);
      await this.carregarPedidos(); // Puxa a lista nova para atualizar a tela
      this.setTab(novoStatusHtml);  // Vai para a aba do pedido que acabou de avançar
    } catch (e) {
      console.error("Erro ao atualizar o status do pedido no banco:", e);
      alert("Houve um erro ao tentar avançar o pedido.");
    }
  }

  // 5. Atribuir Motoboy
  async atribuirMotoboy(pedido: any, selectElement: HTMLSelectElement) {
    const idMoto = selectElement.value;
    if (!idMoto) {
      alert('Por favor, selecione um motoboy disponível na frota.');
      return;
    }

    // Atualizamos o status do pedido para 'saiu_para_entrega' no banco
    await this.avancarPedido(pedido, 'caminho');
    alert('Motoboy atribuído e pedido atualizado para: Saiu para Entrega!');
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