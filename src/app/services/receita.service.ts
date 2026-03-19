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

  private readonly STORAGE_KEY = 'vejate_receitas';

  // Receitas padrão (usadas apenas se não houver nada salvo)
  private receitasPadrao: Receita[] = [
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
  ];

  private _receitas = signal<Receita[]>(this.carregarReceitas());

  receitas = this._receitas.asReadonly();

  constructor() {
    this.salvarNoLocalStorage(); // garante sincronização inicial
  }

  /** ==============================
   *  LOCAL STORAGE
   *  ============================== */

  private carregarReceitas(): Receita[] {
    const dados = localStorage.getItem(this.STORAGE_KEY);

    if (dados) {
      return JSON.parse(dados);
    }

    // Primeira execução → salva receitas padrão
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.receitasPadrao));
    return this.receitasPadrao;
  }

  private salvarNoLocalStorage() {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this._receitas())
    );
  }

  /** ==============================
   *  CRUD
   *  ============================== */

  adicionar(receita: Omit<Receita, 'id'>) {

    const novaReceita: Receita = {
      id: this.gerarNovoId(),
      ...receita
    };

    this._receitas.update(lista => {
      const atualizada = [...lista, novaReceita];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(atualizada));
      return atualizada;
    });
  }

  remover(id: number) {
    this._receitas.update(lista => {
      const atualizada = lista.filter(r => r.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(atualizada));
      return atualizada;
    });
  }

  editar(receitaAtualizada: Receita) {
    this._receitas.update(lista => {
      const atualizada = lista.map(r =>
        r.id === receitaAtualizada.id ? receitaAtualizada : r
      );

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(atualizada));
      return atualizada;
    });
  }

  /** ==============================
   *  UTILIDADES
   *  ============================== */

  private gerarNovoId(): number {
    const lista = this._receitas();
    return lista.length > 0
      ? Math.max(...lista.map(r => r.id)) + 1
      : 1;
  }

  /** Limpa tudo (modo teste/admin) */
  limparTudo() {
    localStorage.removeItem(this.STORAGE_KEY);
    this._receitas.set([]);
  }
}