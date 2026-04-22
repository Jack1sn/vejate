import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { ReceitaService, Receita } from '../../services/receita.service';
import { BuscaService } from '../../services/busca.service';
import { CreditoComponent } from "../../pages/credito/credito";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CreditoComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

   auth = inject(AuthService);
  private router = inject(Router);
  private notificacaoService = inject(NotificacaoService);
  private receitaService = inject(ReceitaService);
  private buscaService = inject(BuscaService);

  // 🔥 Estado UI
  menuAberto = false;
  scrolled = false;
  recargaAberta = false;

  // 🔐 Auth (signals)
  usuario = this.auth.usuario;
  estaLogado = this.auth.estaLogado;
  ehAdmin = this.auth.ehAdmin;

  // 👉 NOVO: nome pronto pro header
  nomeUsuario = this.auth.nomeUsuario;

  // 🔔 Notificações
  notificacoes = this.notificacaoService.notificacoes;

  // 🔎 Busca
  termoBusca = '';
  resultadosDropdown: Receita[] = [];

  // -------------------------
  // MENU
  // -------------------------
  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  logout() {
    this.auth.logout();
    this.menuAberto = false; // 🔥 fecha menu mobile
    this.router.navigate(['/home']);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }

  // -------------------------
  // BUSCA INTELIGENTE
  // -------------------------
  filtrarReceitas() {
    const termo = this.termoBusca?.trim();

    if (!termo) {
      this.resultadosDropdown = [];
      return;
    }

    const termoNorm = termo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    this.resultadosDropdown = this.receitaService.receitas().filter(r => {
      const titulo = r.titulo.toLowerCase();
      const descricao = r.descricao.toLowerCase();
      const categoria = r.categoria.toLowerCase();
      const doencas = r.doencas?.join(' ').toLowerCase() || '';

      return (
        titulo.includes(termoNorm) ||
        descricao.includes(termoNorm) ||
        categoria.includes(termoNorm) ||
        doencas.includes(termoNorm)
      );
    });
  }

  buscar() {
    const termo = this.termoBusca?.trim();
    if (!termo) return;

    this.buscaService.pesquisar(termo);

    this.resetBusca();
    this.router.navigate(['/dor']);
  }

  selecionarReceita(r: Receita) {
    this.buscaService.pesquisar(r.titulo);
    this.resetBusca();
    this.router.navigate(['/dor']);
  }

  private resetBusca() {
    this.termoBusca = '';
    this.resultadosDropdown = [];
  }

  // -------------------------
  // RECARGA
  // -------------------------
  toggleRecarga() {
    this.recargaAberta = !this.recargaAberta;
  }

  abrirRecargaMobile() {
    this.recargaAberta = true;
    this.menuAberto = false;
  }

  fecharRecarga() {
    this.recargaAberta = false;
  }

  mostrarSaldo = false;

toggleSaldo() {
  this.mostrarSaldo = !this.mostrarSaldo;
}
}