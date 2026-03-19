import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent,RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  senha = '';
  erro = '';

  login() {
    this.erro = '';

    // Tenta autenticar com o AuthService
    const sucesso = this.auth.login(this.email, this.senha);

    if (sucesso) {
      // Pega o usuário logado
      const usuario = this.auth.getUsuario();

      if (!usuario) return;

      // Redireciona conforme role
      if (usuario.role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (usuario.role === 'cliente') {
        this.router.navigate(['/cliente']);
      }
    } else {
      this.erro = 'Email ou senha inválidos.';
    }
  }
}
