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
  sucesso = '';
  carregando = false;

  login() {
  if (this.carregando) return;

  this.erro = '';
  this.sucesso = '';
  this.carregando = true;

  this.auth.login(this.email, this.senha).subscribe({
    next: (usuario) => {
      this.sucesso = 'Login realizado com sucesso!';

      setTimeout(() => {
        this.carregando = false;

        if (usuario.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/cliente']);
        }
      }, 2000);
    },
    error: (err) => {
      this.carregando = false;

      // 🔥 SERVIDOR OFFLINE
      if (err.status === 0) {
        this.erro = 'Servidor indisponível. Tente novamente mais tarde.';
      }
      // 🔐 ERRO DE LOGIN
      else if (err.status === 401) {
        this.erro = 'Email ou senha inválidos.';
      }
      // 💥 OUTROS ERROS
      else {
        this.erro = 'Erro inesperado. Tente novamente.';
      }
    }
  });
  }
}