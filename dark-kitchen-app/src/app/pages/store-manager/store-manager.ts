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
  pedidos: any[] = []; 
  listaMotoboys: any[] = [];

  constructor(private dbService: DatabaseService, private orderService: OrderService) {
    this.motoboys$ = this.dbService.getMotoboys();
    this.motoboys$.subscribe(motos => this.listaMotoboys = motos);
  }

  
  ngOnInit() {
    this.orderService.pedidoAtual$.subscribe(pedidoGlobal => {
      this.currentTab = pedidoGlobal.status;
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
      this.orderService.atualizarStatus(novoStatus);
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

    
    let motoboyCompleto = this.listaMotoboys.find(m => m.id === idMoto);
    
    
    if (!motoboyCompleto) {
        const nomeExtraido = optionText.split(' (')[0];
        const placaExtraida = optionText.includes('(') ? optionText.split('(')[1].replace(')', '') : 'N/A';
        motoboyCompleto = { nome: nomeExtraido, placa: placaExtraida, modeloMoto: 'Frota Parceira' };
    }

    if (pedido.id === '1234') {
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

 
  resetarTeste() {
    this.orderService.resetarPedidoTeste();
    this.setTab('recebidos');
    alert('🔄 Pedido #1234 resetado! O teste voltou para o início.');
  }
}