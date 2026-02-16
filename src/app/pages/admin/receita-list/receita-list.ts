import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceitaService } from '../../../services/receita.service';

@Component({
  selector: 'app-receita-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-lg">

      <h2 class="text-xl font-semibold text-green-700 mb-4">
        Receitas Criadas
      </h2>

      <div *ngIf="receitas().length === 0" class="text-gray-500">
        Nenhuma receita cadastrada.
      </div>

      <div *ngFor="let r of receitas()"
           class="flex justify-between items-center border-b py-3">

        <div>
          <p class="font-semibold">{{ r.titulo }}</p>
          <p class="text-sm text-gray-500">{{ r.categoria }}</p>
        </div>

        <button
          (click)="remover(r.id)"
          class="text-red-500 hover:text-red-700">
          Excluir
        </button>

      </div>

    </div>
  `
})
export class ReceitaListComponent {

  private receitaService = inject(ReceitaService);

  // Computed para reatividade
  receitas = computed(() => this.receitaService.receitas());

  remover(id: number) {
    this.receitaService.remover(id);
  }
}
