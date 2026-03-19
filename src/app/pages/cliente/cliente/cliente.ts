import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReceitaService } from '../../../services/receita.service';
import { FooterComponent } from '../../footer/footer';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule,RouterModule, FooterComponent],
  templateUrl: './cliente.html'
})
export class ClienteComponent {

  private receitaService = inject(ReceitaService);
  private route = inject(ActivatedRoute);

  private categoriaParam = signal<string | null>(null);

  // Computed para filtrar receitas dinamicamente
  receitasFiltradas = computed(() => {
    const categoria = this.categoriaParam();
    const todas = this.receitaService.receitas();

    if (!categoria) return todas;

    return todas.filter(r =>
      r.categoria.toLowerCase() === categoria.toLowerCase()
    );
  });

  constructor() {
    this.route.params.subscribe(params => {
      this.categoriaParam.set(params['categoria'] || null);
    });
  }
}