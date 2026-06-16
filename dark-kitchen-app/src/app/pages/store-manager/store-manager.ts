import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DatabaseService } from '../../core/services/database'; 
import { OrderService } from '../../core/services/order.service';
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
  pedidos: any[] = []; // Começa vazio para podermos puxar a memória do navegador
  listaMotoboys: any[] = []; // Variável de apoio para puxarmos Placa e Veículo

  constructor(private dbService: DatabaseService, private orderService: OrderService) {
    this.motoboys$ = this.dbService.getMotoboys();
    // Guarda a frota nos bastidores para podermos puxar os dados completos depois
    this.motoboys$.subscribe(motos => this.listaMotoboys = motos);
  }

  // 1. SOLUÇÃO DO RESET: Lê o Cérebro toda vez que a página carrega
  ngOnInit() {
    this.orderService.pedidoAtual$.subscribe(pedidoGlobal => {
      this.currentTab = pedidoGlobal.status; // Vai para a aba correta sozinho
      
      // Monta a tabela mantendo o pedido #1234 vivo e atualizado
      this.pedidos = [
        pedidoGlobal, 
        { id: '1235', cliente: 'Maria Souza', endereco: 'Av. Paulista, 1000', status: 'preparacao', resumo: '1x Feijão Tropeiro', total: '45,00', pagto: 'Cartão de Crédito', motoboy: null },
        { id: '1236', cliente: 'Carlos Almeida', endereco: 'Rua Augusta, 500', status: 'prontos', resumo: '2x Hambúrguer Artesanal', total: '70,00', pagto: 'Dinheiro', motoboy: null }
      ];
    });
  }

  setTab(tabName: string) {
    this.currentTab = tabName;
  }

  getPedidos(status: string) {
    return this.pedidos.filter(p => p.status === status);
  }

  avancarPedido(pedido: any, novoStatus: string) {
    if (pedido.id === '1234') {
      this.orderService.atualizarStatus(novoStatus); // Envia para a memória global
    } else {
      pedido.status = novoStatus;
      this.setTab(novoStatus); 
    }
  }

  atribuirMotoboy(pedido: any, selectElement: HTMLSelectElement) {
    const idMoto = selectElement.value;
    const optionText = selectElement.options[selectElement.selectedIndex].text;

    if (!idMoto) {
      alert('Por favor, selecione um motoboy disponível na frota.');
      return;
    }

    // 2. SOLUÇÃO DO VEÍCULO: Procura o objeto completo (com Placa e Modelo)
    let motoboyCompleto = this.listaMotoboys.find(m => m.id === idMoto);
    
    // Fallback de segurança caso a internet pisque na hora
    if (!motoboyCompleto) {
        const nomeExtraido = optionText.split(' (')[0];
        const placaExtraida = optionText.includes('(') ? optionText.split('(')[1].replace(')', '') : 'N/A';
        motoboyCompleto = { nome: nomeExtraido, placa: placaExtraida, modeloMoto: 'Frota Parceira' };
    }

    if (pedido.id === '1234') {
      // AGORA SIM: Enviamos o "motoboyCompleto" e a tela do cliente vai conseguir ler os dados!
      this.orderService.atribuirMotoboy(motoboyCompleto);
    } else {
      pedido.motoboy = motoboyCompleto.nome;
      this.avancarPedido(pedido, 'caminho');
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

  // FUNÇÃO NOVA: Chama o serviço para resetar
  resetarTeste() {
    this.orderService.resetarPedidoTeste();
    this.setTab('recebidos'); // Força o gerente a voltar para a primeira aba
    alert('🔄 Pedido #1234 resetado! O teste voltou para o início.');
  }
}