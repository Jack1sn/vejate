import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceitaService } from '../../../services/receita.service';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 pt-28 px-8">

      <h1 class="text-3xl font-bold text-green-700 mb-8">
        🌿 Receitas Naturais
      </h1>

      <div class="grid md:grid-cols-3 gap-6">

        <div *ngFor="let r of receitas()"
             class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

          <h2 class="text-lg font-bold text-green-700">
            {{ r.titulo }}
          </h2>

          <p class="text-gray-600 text-sm mb-2">
            {{ r.categoria }}
          </p>

          <p class="text-gray-700">
            {{ r.descricao }}
          </p>

        </div>

      </div>

    </div>
  `
})
export class ClienteComponent {

  private receitaService = inject(ReceitaService);

  receitas = this.receitaService.receitas;
}
