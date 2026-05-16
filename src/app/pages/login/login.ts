import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, RouterModule],
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

    this.carregando = true;
    this.erro = '';
    this.sucesso = '';

    this.auth.login(this.email, this.senha).subscribe({

      next: () => {

        // 🔥 pega usuário direto do service (já salvo)
        const usuario = this.auth.getUsuario();

        if (!usuario) {
          this.erro = 'Erro ao obter usuário após login';
          this.carregando = false;
          return;
        }

        this.sucesso = 'Login realizado com sucesso!';

        console.log("USUÁRIO LOGADO:", usuario);

        // 🚀 REDIRECIONAMENTO CORRETO
        setTimeout(() => {
          this.carregando = false;

          if (usuario.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']); // 👈 AQUI É O QUE VOCÊ QUER
          }

        }, 300);
      },

      error: (err) => {

        console.error("ERRO LOGIN:", err);

        this.carregando = false;

        if (err.status === 401) this.erro = 'Email ou senha inválidos';
        else if (err.status === 0) this.erro = 'Servidor offline';
        else this.erro = 'Erro inesperado';
      }
    });
  }
}