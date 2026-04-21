import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer';
import { BuscaService } from '../../services/busca.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FooterComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {

  private router = inject(Router);
  private buscaService = inject(BuscaService);

  // input da busca da home
  termoBusca = '';

  // aviso informativo
  avisoCliente = `
    ⚠️ Esta página é apenas informativa.
    As receitas do VEJATE não substituem orientação médica.
  `;

  /**
   * Executa busca global (mesma do header)
   */
  buscar() {
    const termo = this.termoBusca.trim();

    if (!termo) return;

    // usa sistema global de busca
    this.buscaService.pesquisar(termo);

    // limpa input
    this.termoBusca = '';

    // redireciona para página de resultados
    this.router.navigate(['/dor']);
  }

  /**
   * Futuro: tracking ou ações extras ao clicar em categorias
   */
  irParaCategoria(categoria: string) {
    this.router.navigate([`/categoria/${categoria}`]);
  }

}