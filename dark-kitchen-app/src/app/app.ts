import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  // Agora o Angular sabe o que é o RouterLink!
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  router = inject(Router);
  
  showLogin = false;
  loginError = false;

  openLogin() {
    this.showLogin = true;
    this.loginError = false;
  }

  closeLogin() {
    this.showLogin = false;
  }

  doLogin(user: string, pass: string) {
    if (user === 'cliente' && pass === '') {
      this.showLogin = false;
      this.router.navigate(['/pedido']); 
    } else {
      this.loginError = true;
    }
    if (user === 'moto' && pass === '') {
      this.showLogin = false;
      this.router.navigate(['/motoboy']); 
    } else {
      this.loginError = true;
    }
    if (user === 'gerente' && pass === '') {
      this.showLogin = false;
      this.router.navigate(['/painel']); 
    } else {
      this.loginError = true;
    }
  }
}