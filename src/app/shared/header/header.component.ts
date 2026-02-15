import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  private auth = inject(AuthService);
  private router = inject(Router);

  menuAberto = false;
  scrolled = false;

  usuario = this.auth.usuario;
  estaLogado = this.auth.estaLogado;
  ehAdmin = this.auth.ehAdmin;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }
}
