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

  // 🔐 EVITA DUPLA EXECUÇÃO (proteção global)
  private processando = false;

  // 💳 SOLICITAR RECARGA (VERSÃO SEGURA + AUDITADA)
  solicitarRecarga(valor: number) {

    if (this.processando) return;
    this.processando = true;

    const user = this.auth.getUsuario();
    if (!user) {
      this.processando = false;
      return;
    }

    const saldoAntes = user.saldo ?? 0;

    const lista = this.getRecargas();

    let nova: Recarga;

    // 🟢 TEM SALDO → APROVA AUTOMATICAMENTE
    if (saldoAntes >= valor) {

      const saldoDepois = saldoAntes - valor;

      this.auth.descontarSaldo(valor);

      nova = {
        id: Date.now().toString(),
        email: user.email,
        nome: user.nome,
        valor,
        status: 'aprovado',
        saldoAntes,
        saldoDepois,
        tipo: 'auto',
        origem: 'web',
        data: new Date()
      };
    }

    // 🟡 SEM SALDO → FICA PENDENTE
    else {
      nova = {
        id: Date.now().toString(),
        email: user.email,
        nome: user.nome,
        valor,
        status: 'pendente',
        saldoAntes,
        saldoDepois: saldoAntes,
        tipo: 'sistema',
        origem: 'web',
        data: new Date()
      };
    }

    lista.push(nova);

    localStorage.setItem(this.STORAGE, JSON.stringify(lista));
    this.recargas.set(lista);

    // libera lock
    setTimeout(() => {
      this.processando = false;
    }, 500);
  }

  // ✅ APROVAR MANUALMENTE
  aprovarRecarga(id: string) {
    const lista = this.getRecargas();

    const recarga = lista.find(r => r.id === id);
    if (!recarga || recarga.status !== 'pendente') return;

    const user = this.auth.getUsuario();
    if (!user) return;

    const saldoAntes = user.saldo ?? 0;
    const saldoDepois = saldoAntes + recarga.valor;

    recarga.status = 'aprovado';
    recarga.dataProcessamento = new Date();

    this.auth.adicionarSaldo(recarga.valor);

    this.salvar(lista);

    // atualiza auditoria
    recarga.saldoAntes = saldoAntes;
    recarga.saldoDepois = saldoDepois;
  }

  // ❌ REJEITAR
  rejeitarRecarga(id: string) {
    const lista = this.getRecargas();

    const recarga = lista.find(r => r.id === id);
    if (!recarga) return;

    recarga.status = 'rejeitado';
    recarga.dataProcessamento = new Date();

    this.salvar(lista);
  }

  // 📊 FILTRO
  getRecargasPorStatus(status?: Recarga['status']) {
    const recargas = this.getRecargas();

    if (!status) return recargas;

    return recargas.filter(r => r.status === status);
  }

  // 💾 SALVAR CENTRALIZADO
  private salvar(lista: Recarga[]) {
    localStorage.setItem(this.STORAGE, JSON.stringify(lista));
    this.recargas.set(lista);
  }

  // 📦 LOAD COM FIX DATE
  private getRecargas(): Recarga[] {
    const data = localStorage.getItem(this.STORAGE);
    if (!data) return [];

    return JSON.parse(data).map((r: any) => ({
      ...r,
      data: new Date(r.data),
      dataProcessamento: r.dataProcessamento ? new Date(r.dataProcessamento) : undefined
    }));
  }
}