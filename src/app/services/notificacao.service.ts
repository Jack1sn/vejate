import { Injectable, signal } from '@angular/core';

export interface Notificacao {
  mensagem: string;
  lida: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificacaoService {

  private notificacoesSignal = signal<Notificacao[]>([]);

  notificacoes = this.notificacoesSignal;

  adicionar(msg: string) {
    this.notificacoesSignal.update(n => [
      ...n,
      { mensagem: msg, lida: false }
    ]);
  }

  marcarComoLida(index: number) {
    this.notificacoesSignal.update(n => {
      n[index].lida = true;
      return [...n];
    });
  }
}
