import { Injectable, signal } from '@angular/core';

export interface EtapaPreparo {
  descricao: string;
  medida?: string;
}

export interface Receita {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  modoPreparo: EtapaPreparo[];
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
      categoria: 'Imunidade',
      modoPreparo: [
        { medida: '2 fatias', descricao: 'Corte o gengibre em fatias finas' },
        { medida: '200 ml', descricao: 'Ferva água e adicione o gengibre' },
        { descricao: 'Deixe repousar por 10 minutos antes de coar' }
      ]
    },
    {
      id: 2,
      titulo: 'Camomila',
      descricao: 'Ajuda no sono',
      categoria: 'Calmante',
      modoPreparo: [
        { medida: '1 colher de sopa', descricao: 'Coloque flores de camomila em água quente' },
        { descricao: 'Deixe em infusão por 5 minutos e coe' }
      ]
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
    this._receitas.set(
      this._receitas().map(r =>
        r.id === receitaAtualizada.id ? receitaAtualizada : r
      )
    );
  }

}
