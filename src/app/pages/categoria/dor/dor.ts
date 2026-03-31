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
    // ⚡ Efeito que atualiza o componente quando os sinais mudam
    effect(() => {
      this.resultados = this.buscaService.resultados(); // sinal readonly
      this.historico = this.buscaService.historico();   // sinal readonly
      this.termoAtual = this.buscaService.ultimoTermo(); // método do service
    });
  }
}