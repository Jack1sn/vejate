import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReceitaService } from '../../../services/receita.service';
import { FooterComponent } from '../../footer/footer';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './cliente.html'
})
export class ClienteComponent {

  private receitaService = inject(ReceitaService);
  private route = inject(ActivatedRoute);

  private categoriaParam = signal<string | null>(null);
  private buscaParam = signal<string | null>(null); // 🔥 NOVO

  receitasFiltradas = computed(() => {
    const categoria = this.categoriaParam();
    const busca = this.buscaParam()?.toLowerCase();
    const todas = this.receitaService.receitas();

    return todas.filter(r => {

      // filtro categoria
      const matchCategoria = categoria
        ? r.categoria.toLowerCase() === categoria.toLowerCase()
        : true;

      // filtro busca
      const matchBusca = busca
        ? (
            r.titulo.toLowerCase().includes(busca) ||
            r.descricao.toLowerCase().includes(busca) ||
            r.categoria.toLowerCase().includes(busca) ||
            r.doencas?.some((d: string) =>
              busca.includes(d.toLowerCase()) ||
              d.toLowerCase().includes(busca)
            )
          )
        : true;

      return matchCategoria && matchBusca;
    });
  });

  constructor() {

    // categoria (/categoria/imunidade)
    this.route.params.subscribe(params => {
      this.categoriaParam.set(params['categoria'] || null);
    });

    // 🔥 busca (?busca=gripe)
    this.route.queryParams.subscribe(query => {
      this.buscaParam.set(query['busca'] || null);
    });
  }
}