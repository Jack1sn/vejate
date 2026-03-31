import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface EtapaPreparo {
  descricao: string;
  medida?: string;
}

export interface Receita {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  doencas?: string[];
  modoPreparo: EtapaPreparo[];
}

@Injectable({
  providedIn: 'root'
})
export class ReceitaService {

  private readonly STORAGE_KEY = 'vejate_receitas';
  private readonly JSON_PATH = 'assets/receitas.json';

  private _receitas = signal<Receita[]>([]);

  receitas = this._receitas.asReadonly();

  constructor(private http: HttpClient) {
    this.init();
  }

  /** ==============================
   *  INICIALIZAÇÃO
   *  ============================== */
  private async init() {
    const local = localStorage.getItem(this.STORAGE_KEY);

    if (local) {
      this._receitas.set(JSON.parse(local));
    } else {
      // Tenta carregar do JSON externo
      try {
        const jsonReceitas: Receita[] = await firstValueFrom(this.http.get<Receita[]>(this.JSON_PATH));
        this._receitas.set(jsonReceitas);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(jsonReceitas));
      } catch (e) {
        console.warn('Não foi possível carregar receitas do JSON, usando padrão interno.', e);

        const padrao: Receita[] = [
          {
            id: 1,
            titulo: 'Chá de Gengibre',
            descricao: 'Fortalece a imunidade',
            categoria: 'Imunidade',
            doencas: ['gripe', 'resfriado'],
            modoPreparo: [
              { medida: '3 fatias', descricao: 'Corte o gengibre em fatias finas' },
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

        this._receitas.set(padrao);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(padrao));
      }
    }
  }

  /** ==============================
   *  CRUD
   *  ============================== */
  adicionar(receita: Omit<Receita, 'id'>) {
    const nova: Receita = { id: this.gerarNovoId(), ...receita };
    this._receitas.update(lista => {
      const atualizada = [...lista, nova];
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
      const atualizada = lista.map(r => r.id === receitaAtualizada.id ? receitaAtualizada : r);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(atualizada));
      return atualizada;
    });
  }

  /** ==============================
   *  UTILIDADES
   *  ============================== */
  private gerarNovoId(): number {
    const lista = this._receitas();
    return lista.length > 0 ? Math.max(...lista.map(r => r.id)) + 1 : 1;
  }

  limparTudo() {
    localStorage.removeItem(this.STORAGE_KEY);
    this._receitas.set([]);
  }
}