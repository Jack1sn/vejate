import { Injectable, signal } from '@angular/core';

export interface Receita {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReceitaService {

  private contador = 3;

  private _receitas = signal<Receita[]>([
    {
      id: 1,
      titulo: 'Chá de Gengibre',
      descricao: 'Fortalece a imunidade',
      categoria: 'Imunidade'
    },
    {
      id: 2,
      titulo: 'Camomila',
      descricao: 'Ajuda no sono',
      categoria: 'Calmante'
    }
  ]);

  receitas = this._receitas.asReadonly();

  adicionar(receita: Omit<Receita, 'id'>) {
    this._receitas.update(lista => [
      ...lista,
      { id: this.contador++, ...receita }
    ]);
  }

  remover(id: number) {
    this._receitas.update(lista =>
      lista.filter(r => r.id !== id)
    );
  }

 editar(receitaAtualizada: Receita) {
  this._receitas.set(this._receitas().map(r =>
    r.id === receitaAtualizada.id ? receitaAtualizada : r
  ));
}

}
