import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private firestore: Firestore = inject(Firestore);

  // 1. Função de Gravar (Mantida igual, pois já vimos que funciona!)
  addMotoboy(dados: any) {
    const motoboysRef = collection(this.firestore, 'motoboys');
    return addDoc(motoboysRef, dados);
  }

  // 2. Função de Ler (A SOLUÇÃO DEFINITIVA)
  getMotoboys(): Observable<any[]> {
    const motoboysRef = collection(this.firestore, 'motoboys');
    
    // Criamos o nosso próprio fluxo de dados contornando o bug do AngularFire
    return new Observable(observer => {
      
      const unsubscribe = onSnapshot(motoboysRef, 
        (snapshot) => {
          // Extrai os dados e já cola a ID do documento junto
          const motoboys = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          observer.next(motoboys); // Manda a lista pronta para a tela
        },
        (error) => {
          console.error("Erro interno ao tentar escutar o Firebase:", error);
          observer.error(error);
        }
      );

      // Limpa a memória quando a tela for fechada
      return () => unsubscribe();
    });
  }
}