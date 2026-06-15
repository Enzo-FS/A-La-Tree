import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>

    <button class="btn-floating" (click)="openLogin()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </button>

    @if (showLogin) {
      <div class="modal-overlay">
        <div class="login-box">
          <button class="btn-close" (click)="closeLogin()">✕</button>
          
          <h2 class="login-title">Acesso Restrito</h2>
          <p class="login-subtitle">Gestão operacional Dark Kitchen</p>

          <div class="input-group">
            <label>Usuário</label>
            <input type="text" #user placeholder="Ex: admin" autocomplete="off" />
          </div>

          <div class="input-group">
            <label>Senha</label>
            <input type="password" #pass placeholder="••••••••" />
          </div>

          <button class="btn-login" (click)="doLogin(user.value, pass.value)">Entrar no Sistema</button>
          
          @if (loginError) {
            <p class="error-msg">Credenciais inválidas. Tente novamente.</p>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    /* ─── BOTÃO FLUTUANTE ─── */
    .btn-floating {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #E5E7EB;
      border-radius: 50%;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6B7280;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 999;
      backdrop-filter: blur(4px);
    }
    .btn-floating:hover {
      transform: scale(1.05);
      color: #1A1A1A;
      box-shadow: 0 6px 20px rgba(0,0,0,0.12);
    }

    /* ─── OVERLAY E MODAL (GLASSMORPHISM) ─── */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }
    
    .login-box {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
      border-radius: 16px;
      padding: 32px;
      width: 90%;
      max-width: 340px;
      position: relative;
      font-family: 'Inter', sans-serif;
    }

    .btn-close {
      position: absolute;
      top: 16px; right: 16px;
      color: #9CA3AF;
      font-size: 14px;
      font-weight: bold;
      transition: color 0.2s;
    }
    .btn-close:hover { color: #111827; }

    .login-title {
      font-size: 18px;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.02em;
      margin-bottom: 4px;
    }
    .login-subtitle {
      font-size: 12px;
      color: #6B7280;
      margin-bottom: 24px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }
    .input-group label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #4B5563;
    }
    .input-group input {
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid #D1D5DB;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      background: #F9FAFB;
    }
    .input-group input:focus {
      border-color: #E27E0C;
      background: #FFFFFF;
    }

    .btn-login {
      width: 100%;
      padding: 14px;
      margin-top: 8px;
      background: #111827; /* Cor preta corporativa para contraste */
      color: #FFFFFF;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      transition: background 0.2s;
    }
    .btn-login:hover { background: #374151; }

    .error-msg {
      color: #DC2626;
      font-size: 11px;
      font-weight: 600;
      text-align: center;
      margin-top: 12px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class App {
  // Injetamos o roteador para fazer a navegação programática
  router = inject(Router);
  
  showLogin = false;
  loginError = false;

  openLogin() {
    this.showLogin = true;
    this.loginError = false; // Reseta o erro ao abrir
  }

  closeLogin() {
    this.showLogin = false;
  }

  doLogin(user: string, pass: string) {
    // Simulação temporária de segurança até implementarmos o Firebase Auth
    if (user === 'admin' && pass === '1234') {
      this.showLogin = false; // Fecha o modal
      this.router.navigate(['/painel']); // Dispara o navegador para a tela da loja
    } else {
      this.loginError = true; // Mostra a mensagem de erro
    }
  }
}