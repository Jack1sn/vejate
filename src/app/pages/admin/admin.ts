import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RemedioService } from '../../services/remedio.service';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="p-8">
    <h1 class="text-2xl font-bold text-red-600 mb-4">
      Painel Administrativo
    </h1>

    <input [(ngModel)]="nome"
           placeholder="Nome"
           class="border p-2 mr-2"/>

    <button (click)="adicionar()"
            class="bg-green-600 text-white px-4 py-2 rounded">
      Adicionar
    </button>

    <div class="mt-6">
      <div *ngFor="let r of remedios()"
           class="flex justify-between border p-2 mb-2">

        <span>{{r.nome}}</span>

        <button (click)="remover(r.id)"
                class="text-red-600">
          Excluir
        </button>
      </div>
    </div>
  </div>
  `
})
export class AdminComponent {

  nome = '';
  remedios;

  constructor(private service: RemedioService) {
    this.remedios = service.remedios;
  }

  adicionar() {
    this.service.adicionar({
      id: Date.now(),
      nome: this.nome,
      descricao: '',
      beneficios: '',
      modoPreparo: '',
      imagem: ''
    });

    this.nome = '';
  }

  remover(id: number) {
    this.service.remover(id);
  }
}
