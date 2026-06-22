import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // O seu arquivo de rotas

// ── Importações do Firebase (Do código do seu colega) ────────────────
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

// ── Importações de Ambiente e Tokens ─────────────────────────────────
import { environment } from '../environments/environment';
// ATENÇÃO: Ajustei o caminho do token para a pasta onde descobrimos que ele estava antes!
import { FIRESTORE_GERENCIA } from './core/services/firestore-gerencia.token';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. O seu roteador (Isso garante que os botões da Navbar funcionem)
    provideRouter(routes),

    // 2. App principal (cardapio-a-la-tree): login, pedidos, cadastros
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),

    // 3. App secundária, nomeada 'gerencia' (gerencia-a-la-tree): catálogo/cardápio
    provideFirebaseApp(() => initializeApp(environment.firebaseGerencia, 'gerencia')),
    {
      provide: FIRESTORE_GERENCIA,
      useFactory: () => getFirestore(getApp('gerencia')),
    },
  ]
};