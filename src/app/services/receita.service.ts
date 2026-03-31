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

  private readonly JSON_PATH = 'receitas.json';

  private _receitas = signal<Receita[]>([]);
  receitas = this._receitas.asReadonly();

  constructor(private http: HttpClient) {
    this.loadReceitas();
  }

  /** Carrega direto do JSON */
  private async loadReceitas() {
    try {
      const jsonReceitas: Receita[] = await firstValueFrom(
        this.http.get<Receita[]>(this.JSON_PATH)
      );
      this._receitas.set(jsonReceitas);
      console.log('Receitas carregadas do JSON:', jsonReceitas);
    } catch (e) {
      console.error('Falha ao carregar receitas do JSON', e);
      // opcional: fallback interno
      this._receitas.set([]);
    }
  }

  /** ==============================
   *  CRUD básico
   *  ============================== */
  adicionar(receita: Omit<Receita, 'id'>) {
    const nova: Receita = { id: this.gerarNovoId(), ...receita };
    this._receitas.update(lista => [...lista, nova]);
  }

  remover(id: number) {
    this._receitas.update(lista => lista.filter(r => r.id !== id));
  }

  editar(receitaAtualizada: Receita) {
    this._receitas.update(lista =>
      lista.map(r => r.id === receitaAtualizada.id ? receitaAtualizada : r)
    );
  }

  private gerarNovoId(): number {
    const lista = this._receitas();
    return lista.length > 0 ? Math.max(...lista.map(r => r.id)) + 1 : 1;
  }

  limparTudo() {
    this._receitas.set([]);
  }
}