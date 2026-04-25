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

  this.auth.login(this.email, this.senha).subscribe({
    next: (usuario) => {
      if (usuario.role === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/cliente']);
      }
    },
    error: () => {
      this.erro = 'Email ou senha inválidos.';
    }
  });
}
}
