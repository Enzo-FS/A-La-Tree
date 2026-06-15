import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// 1. Moldes dos nossos dados (Interfaces)
export interface Motoboy {
  id?: string;
  nome: string;
  placa: string;
  modeloMoto: string;
  telefone: string;
  ativo: boolean; // Para sabermos se ele está trabalhando hoje
}

export interface Produto {
  id?: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string; // Ex: 'Lanches', 'Bebidas'
  disponivel: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  // Injeta a conexão com o Firestore que o 'ng add @angular/fire' preparou
  private firestore = inject(Firestore);

  // Referências para as nossas duas "pastas" no banco de dados
  private motoboysCollection = collection(this.firestore, 'motoboys');
  private cardapioCollection = collection(this.firestore, 'cardapio');

  // ==========================================
  // FUNÇÕES PARA OS MOTOBOYS
  // ==========================================

  // Busca todos os motoboys cadastrados em tempo real
  getMotoboys(): Observable<Motoboy[]> {
    return collectionData(this.motoboysCollection, { idField: 'id' }) as Observable<Motoboy[]>;
  }

  // Adiciona um novo motoboy ao banco
  addMotoboy(motoboy: Motoboy) {
    return addDoc(this.motoboysCollection, motoboy);
  }

  // ==========================================
  // FUNÇÕES PARA O CARDÁPIO
  // ==========================================

  // Busca todo o cardápio em tempo real
  getCardapio(): Observable<Produto[]> {
    return collectionData(this.cardapioCollection, { idField: 'id' }) as Observable<Produto[]>;
  }

  // Adiciona um novo item ao cardápio
  addProduto(produto: Produto) {
    return addDoc(this.cardapioCollection, produto);
  }
}