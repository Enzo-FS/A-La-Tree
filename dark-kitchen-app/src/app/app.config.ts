import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importações do Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Suas chaves reais do projeto A-La-Tree
const firebaseConfig = {
  apiKey: "AIzaSyAZtYX43hOoqlpiKEHtJcEWXODQHyDY5dM",
  authDomain: "a-la-tree.firebaseapp.com",
  projectId: "a-la-tree",
  storageBucket: "a-la-tree.firebasestorage.app",
  messagingSenderId: "499713615315",
  appId: "1:499713615315:web:a68beb5c894c6aba757b26",
  measurementId: "G-T0SR99182G"
};

// Configuração principal da aplicação
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // Ligando o motor do Firebase usando o padrão do Angular
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
};