import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceitaService } from '../../../services/receita.service';

@Component({
  selector: 'app-receita-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-lg">

      <h2 class="text-xl font-semibold text-green-700 mb-4">
        Nova Receita
      </h2>

      <input
        type="text"
        placeholder="Título"
        [(ngModel)]="titulo"
        class="w-full mb-3 px-4 py-2 border rounded"
      />

      <textarea
        placeholder="Descrição"
        [(ngModel)]="descricao"
        class="w-full mb-3 px-4 py-2 border rounded"
      ></textarea>

      <select [(ngModel)]="categoria"
        class="w-full mb-4 px-4 py-2 border rounded">

        <option value="Imunidade">Imunidade</option>
        <option value="Calmante">Calmante</option>
        <option value="Foco">Foco</option>
        <option value="Digestão">Digestão</option>
        <option value="Dor">Dor</option>

      </select>

      <button
        (click)="salvar()"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
        Salvar Receita
      </button>

    </div>
  `
})
export class ReceitaFormComponent {

  private receitaService = inject(ReceitaService);

  titulo = '';
  descricao = '';
  categoria = '';

  salvar() {
    if (!this.titulo || !this.descricao || !this.categoria) return;

    this.receitaService.adicionar({
      titulo: this.titulo,
      descricao: this.descricao,
      categoria: this.categoria
    });

    // Limpar form
    this.titulo = '';
    this.descricao = '';
    this.categoria = '';
  }
}
