import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { Recarga } from '../models/recarga.model';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {

  private STORAGE = 'vejate_recargas';

  recargas = signal<Recarga[]>(this.getRecargas());

  constructor(private auth: AuthService) {}

solicitarRecarga(valor: number) {
  const user = this.auth.getUsuario();
  if (!user) return;

  const saldo = user.saldo ?? 0;

  const lista = this.getRecargas();

  // 🟢 CASO TENHA SALDO
  if (saldo >= valor) {
    this.auth.descontarSaldo(valor);

    const nova: Recarga = {
      id: Date.now().toString(),
      email: user.email,
      nome :user.nome,
      valor,
      status: 'aprovado',
      data: new Date()
    };

    lista.push(nova);

    localStorage.setItem(this.STORAGE, JSON.stringify(lista));
    this.recargas.set(lista);

    return;
  }

  // 🟡 CASO NÃO TENHA SALDO
  const nova: Recarga = {
    id: Date.now().toString(),
    email: user.email,
    nome : user.nome,
    valor,
    status: 'pendente',
    data: new Date()
  };

  lista.push(nova);

  localStorage.setItem(this.STORAGE, JSON.stringify(lista));
  this.recargas.set(lista);
}

  aprovarRecarga(id: string) {
    const lista = this.getRecargas();

    const recarga = lista.find(r => r.id === id);
    if (!recarga) return;

    recarga.status = 'aprovado';

    // 🔥 atualiza saldo
    this.auth.adicionarSaldo(recarga.valor);

    localStorage.setItem(this.STORAGE, JSON.stringify(lista));
    this.recargas.set(lista);
  }

  rejeitarRecarga(id: string) {
    const lista = this.getRecargas();

    const recarga = lista.find(r => r.id === id);
    if (!recarga) return;

    recarga.status = 'rejeitado';

    localStorage.setItem(this.STORAGE, JSON.stringify(lista));
    this.recargas.set(lista);
  }

  private getRecargas(): Recarga[] {
    const data = localStorage.getItem(this.STORAGE);

    if (!data) return [];

    const parsed = JSON.parse(data);

    // 🔥 corrige Date (muito importante)
    return parsed.map((r: any) => ({
      ...r,
      data: new Date(r.data)
    }));
  }

  getRecargasPorStatus(status?: string) {
  const recargas = this.getRecargas();

  if (!status) return recargas;

  return recargas.filter(r => r.status === status);
}
}