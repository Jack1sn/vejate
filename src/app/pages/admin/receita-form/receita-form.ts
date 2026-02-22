import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceitaService, EtapaPreparo } from '../../../services/receita.service';

@Component({
  selector: 'app-receita-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">

      <h2 class="text-2xl font-semibold text-green-700 mb-6">
        🌿 Nova Receita
      </h2>

      <!-- Título -->
      <input
        type="text"
        placeholder="Título"
        [(ngModel)]="titulo"
        class="w-full mb-4 px-4 py-2 border rounded"
      />

      <!-- Descrição -->
      <textarea
        placeholder="Descrição"
        [(ngModel)]="descricao"
        class="w-full mb-4 px-4 py-2 border rounded"
      ></textarea>

      <!-- Categoria -->
      <select [(ngModel)]="categoria"
        class="w-full mb-4 px-4 py-2 border rounded">
        <option value="">Selecione a categoria</option>
        <option value="Imunidade">Imunidade</option>
        <option value="Calmante">Calmante</option>
        <option value="Foco">Foco</option>
        <option value="Digestão">Digestão</option>
        <option value="Dor">Dor</option>
      </select>

      <!-- Etapas de preparo -->
      <div class="mb-4">
        <h3 class="font-semibold text-green-700 mb-2">Adicionar etapa de preparo</h3>

        <input
          placeholder="Descrição da etapa"
          [(ngModel)]="etapaDescricao"
          class="w-full mb-2 px-3 py-2 border rounded"
        />

        <input
          placeholder="Medida (opcional)"
          [(ngModel)]="etapaMedida"
          class="w-full mb-2 px-3 py-2 border rounded"
        />

        <button
          (click)="adicionarEtapa()"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Adicionar Etapa
        </button>

        <!-- Lista de etapas -->
        <ul class="mt-3 list-decimal list-inside space-y-1">
          <li *ngFor="let e of modoPreparo; let i = index" class="flex justify-between items-center">
            <span>
              <strong *ngIf="e.medida">{{ e.medida }} - </strong>{{ e.descricao }}
            </span>
            <button
              (click)="removerEtapa(i)"
              class="text-red-500 hover:text-red-700 text-sm font-bold ml-2">
              ✕
            </button>
          </li>
        </ul>
      </div>

      <!-- Botão Salvar Receita -->
      <button
        (click)="salvar()"
        class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition w-full">
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
  modoPreparo: EtapaPreparo[] = [];

  // Campos temporários para nova etapa
  etapaDescricao = '';
  etapaMedida = '';

  /**
   * Adiciona nova etapa ao modoPreparo
   */
  adicionarEtapa() {
    if (!this.etapaDescricao.trim()) return;

    this.modoPreparo.push({
      descricao: this.etapaDescricao,
      medida: this.etapaMedida || undefined
    });

    this.etapaDescricao = '';
    this.etapaMedida = '';
  }

  /**
   * Remove etapa pelo índice
   */
  removerEtapa(index: number) {
    this.modoPreparo.splice(index, 1);
  }

  /**
   * Salva receita completa
   */
  salvar() {
    if (!this.titulo.trim() || !this.descricao.trim() || !this.categoria || this.modoPreparo.length === 0) return;

    this.receitaService.adicionar({
      titulo: this.titulo,
      descricao: this.descricao,
      categoria: this.categoria,
      modoPreparo: this.modoPreparo
    });

    // Limpar formulário
    this.titulo = '';
    this.descricao = '';
    this.categoria = '';
    this.modoPreparo = [];
    this.etapaDescricao = '';
    this.etapaMedida = '';
  }
}
