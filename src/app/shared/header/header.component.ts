import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router,  } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NotificacaoService } from '../../services/notificacao.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  private auth = inject(AuthService);
  private router = inject(Router);
  private  notificacaoservice = inject(NotificacaoService);

  menuAberto = false;
  scrolled = false;

  usuario = this.auth.usuario;
  estaLogado = this.auth.estaLogado;
  ehAdmin = this.auth.ehAdmin;
  notificacoes = this.notificacaoservice.notificacoes

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

  termoBusca = '';

buscar() {
  if (this.termoBusca.trim()) {
    this.router.navigate(['/buscar'], {
      queryParams: { q: this.termoBusca }
    });
  }
}

}
