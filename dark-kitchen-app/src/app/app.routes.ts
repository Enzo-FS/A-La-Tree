import { Routes } from '@angular/router';

// Atualizamos os caminhos para o nome exato dos arquivos da sua imagem
import { CustomerTracking } from './pages/customer-tracking/customer-tracking';
import { StoreManager } from './pages/store-manager/store-manager';
import { DriverPanel } from './pages/driver-panel/driver-panel';

export const routes: Routes = [
  // Usamos os nomes das classes exatas que foram importadas acima
  { path: 'pedido', component: CustomerTracking },
  
  { path: 'painel', component: StoreManager },
  
  { path: '', redirectTo: 'pedido', pathMatch: 'full' },

  { path: 'motoboy', component: DriverPanel }
];