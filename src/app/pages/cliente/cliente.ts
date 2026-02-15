import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemedioService } from '../../services/remedio.service';

@Component({
  standalone: true,
  selector: 'app-cliente',
  imports: [CommonModule],
  template: `
  <div class="p-8">
    <h1 class="text-2xl font-bold text-blue-600 mb-4">
      Área do Cliente
    </h1>

    <div *ngFor="let r of remedios()"
         class="border p-4 mb-2 rounded">
      {{r.nome}}
    </div>
  </div>
  `
})
export class ClienteComponent {
  remedios;

  constructor(private service: RemedioService) {
    this.remedios = service.remedios;
  }
}
