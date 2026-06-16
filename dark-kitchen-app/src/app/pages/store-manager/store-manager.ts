import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DatabaseService } from '../../core/services/database'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-store-manager',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './store-manager.html',
  styleUrl: './store-manager.css'
})
export class StoreManager {
  currentTab: string = 'recebidos';

  // O símbolo de cifrão ($) indica que é um fluxo de dados em tempo real
  motoboys$: Observable<any[]>;

  // Banco de dados fictício de pedidos
  pedidos = [
    { id: '1234', cliente: 'João Silva', endereco: 'Rua Tiradentes, 67', status: 'recebidos', resumo: '1x Frango Tailandês, 2x Salada', total: '187,00', pagto: 'Via PIX', motoboy: null },
    { id: '1235', cliente: 'Maria Souza', endereco: 'Av. Paulista, 1000', status: 'preparacao', resumo: '1x Feijão Tropeiro', total: '45,00', pagto: 'Cartão de Crédito', motoboy: null },
    { id: '1236', cliente: 'Carlos Almeida', endereco: 'Rua Augusta, 500', status: 'prontos', resumo: '2x Hambúrguer Artesanal', total: '70,00', pagto: 'Dinheiro', motoboy: null }
  ];

  // Apenas UM construtor mantendo a conexão com o banco
  constructor(private dbService: DatabaseService) {
    this.motoboys$ = this.dbService.getMotoboys();
  }

  setTab(tabName: string) {
    this.currentTab = tabName;
  }

  // Puxa apenas os pedidos da etapa em que estamos olhando
  getPedidos(status: string) {
    return this.pedidos.filter(p => p.status === status);
  }

  // Empurra o pedido para a próxima aba
  avancarPedido(pedido: any, novoStatus: string) {
    pedido.status = novoStatus;
    this.setTab(novoStatus); 
  }

  // Pega o ID e o Nome do Motoboy no menu dropdown e vincula ao pedido
  atribuirMotoboy(pedido: any, selectElement: HTMLSelectElement) {
    const idMoto = selectElement.value;
    const nomeMoto = selectElement.options[selectElement.selectedIndex].text;

    if (!idMoto) {
      alert('Por favor, selecione um motoboy disponível na frota.');
      return;
    }

    pedido.motoboy = nomeMoto;
    this.avancarPedido(pedido, 'caminho');
  }

  // Cadastro oficial de motoboys
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
}