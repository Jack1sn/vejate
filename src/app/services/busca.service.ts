import { Injectable, signal } from '@angular/core';
import { ReceitaService, Receita } from './receita.service';

@Injectable({
  providedIn: 'root'
})
export class BuscaService {

  private _historico = signal<string[]>([]);
  historico = this._historico.asReadonly();

  private _resultados = signal<Receita[]>([]);
  resultados = this._resultados.asReadonly();

  private _ultimoTermo = '';

  constructor(private receitaService: ReceitaService) {}

  pesquisar(termo: string) {
    const t = termo?.trim();
    if (!t) {
      this._resultados.set([]);
      return;
    }

    this._ultimoTermo = t;

    // Adiciona termo ao histórico
    this._historico.set([t, ...this._historico()].slice(0, 50));

    // Normaliza termo
    const termoNorm = t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Filtra receitas
    const res: Receita[] = this.receitaService.receitas().filter(r =>
      r.titulo.toLowerCase().includes(termoNorm) ||
      r.descricao.toLowerCase().includes(termoNorm) ||
      r.categoria.toLowerCase().includes(termoNorm) ||
      (r.doencas && r.doencas.some(d => d.toLowerCase().includes(termoNorm)))
    );

    this._resultados.set(res);
  }

  limpar() {
    this._resultados.set([]);
    this._historico.set([]);
  }

  // Retorna se há resultados ou não
  temResultados(): boolean {
    return this._resultados().length > 0;
  }

  ultimoTermo(): string {
    return this._ultimoTermo;
  }
}