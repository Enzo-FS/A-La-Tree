import { Routes } from '@angular/router';

// ─── 1. ROTAS DA OPERAÇÃO (As suas rotas originais) ───
import { CustomerTracking } from './pages/customer-tracking/customer-tracking';
import { StoreManager } from './pages/store-manager/store-manager';
import { DriverPanel } from './pages/driver-panel/driver-panel';

// ─── 2. ROTAS DO CLIENTE (As telas que sua equipe fez) ───
// ATENÇÃO: Se você colou a pasta diretamente dentro de 'app' com o nome 'components',
// mude o caminho abaixo de './pages/client-app/...' para './components/...'.
import { HomeComponent } from './pages/client-app/home/home.component';
import { ExploreComponent } from './pages/client-app/explore/explore.component';
import { PaymentComponent } from './pages/client-app/payment/payment.component';
import { LoginComponent } from './pages/client-app/login/login.component';
import { OrdersComponent } from './pages/client-app/orders/orders.component';

export const routes: Routes = [
  
  // ─── ÁREA DO CLIENTE FINAL ───
  { path: 'home', component: HomeComponent },
  { path: 'explorar', component: ExploreComponent },
  { path: 'pagamento', component: PaymentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'meus-pedidos', component: OrdersComponent },

  // ─── ÁREA OPERACIONAL (Seu ecossistema) ───
  { path: 'pedido', component: CustomerTracking },
  { path: 'painel', component: StoreManager },
  { path: 'motoboy', component: DriverPanel },

  // ─── ROTA PADRÃO (O que abre ao acessar o site "limpo") ───
  // Alterei para redirecionar para a 'home' do cliente primeiro, 
  // já que agora temos uma vitrine completa.
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ─── ROTA CORINGA (Segurança) ───
  // Se alguém digitar uma URL que não existe (ex: /batata), 
  // o sistema joga a pessoa de volta para a Home em vez de quebrar a tela.
  { path: '**', redirectTo: 'home' }
];