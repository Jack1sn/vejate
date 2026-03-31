import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscaService } from '../../../services/busca.service';
import { Receita } from '../../../services/receita.service';

@Component({
  selector: 'app-dor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dor.html',
  styleUrls: ['./dor.css']
})
export class DorComponent {

  private buscaService = inject(BuscaService);

  resultados: Receita[] = [];
  historico: string[] = [];
  termoAtual = '';

  constructor() {
    effect(() => {
      this.resultados = this.buscaService.resultados();
      this.historico = this.buscaService.historico();
      this.termoAtual = this.buscaService.ultimoTermo();
    });
  }
}