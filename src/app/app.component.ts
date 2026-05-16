import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService, Usuario } from './services/usuario.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterModule, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.atualizarUsuarioLogado();
  }

  atualizarUsuarioLogado(): void {
    this.usuarioService.getMe().subscribe({
      next: (user: Usuario) => {
        // atualiza localStorage (fonte única de verdade no seu app hoje)
        const storageUser = JSON.parse(localStorage.getItem('user') || '{}');

        const updatedUser = {
          ...storageUser,
          ...user
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
      },
      error: (err) => {
        console.error('Erro ao buscar /me:', err);
      }
    });
  }
}