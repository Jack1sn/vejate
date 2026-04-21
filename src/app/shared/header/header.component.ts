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

  private auth = inject(AuthService);
  private router = inject(Router);
  private notificacaoService = inject(NotificacaoService);
  private receitaService = inject(ReceitaService);
  private buscaService = inject(BuscaService);

  menuAberto = false;
  scrolled = false;

  usuario = this.auth.usuario;
  estaLogado = this.auth.estaLogado;
  ehAdmin = this.auth.ehAdmin;
  notificacoes = this.notificacaoService.notificacoes;

  termoBusca = '';
  resultadosDropdown: Receita[] = [];

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

  // Sugestões enquanto digita
  filtrarReceitas() {
    const termo = this.termoBusca?.trim();
    if (!termo) {
      this.resultadosDropdown = [];
      return;
    }

    const termoNorm = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    this.resultadosDropdown = this.receitaService.receitas().filter(r =>
      r.titulo.toLowerCase().includes(termoNorm) ||
      r.descricao.toLowerCase().includes(termoNorm) ||
      r.categoria.toLowerCase().includes(termoNorm) ||
      (r.doencas && r.doencas.some(d => d.toLowerCase().includes(termoNorm)))
    );
  }

  // Pesquisa completa
  buscar() {
    const termo = this.termoBusca?.trim();
    if (!termo) return;

    this.buscaService.pesquisar(termo);

    this.termoBusca = '';
    this.resultadosDropdown = [];

    this.router.navigate(['/dor']);
  }

  selecionarReceita(r: Receita) {
    this.buscaService.pesquisar(r.titulo);
    this.router.navigate(['/dor']);
    this.termoBusca = '';
    this.resultadosDropdown = [];
  }


  //----
  recargaAberta = false;

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
}