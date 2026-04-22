import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecargaService } from '../../services/recarga.service';
import { AuthService } from '../../services/auth.service';
import { Recarga } from '../../models/recarga.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent {

  private recargaService = inject(RecargaService);
  private auth = inject(AuthService);

  recargas = this.recargaService.recargas;

  // ================= FILTROS =================
  filtro: 'todos' | 'pendente' | 'aprovado' | 'rejeitado' = 'todos';
  filtroTexto = '';
  filtroData: string = '';

  // ================= PAGINAÇÃO =================
  pagina = 1;
  porPagina = 5;

  valoresSaldo: { [email: string]: number } = {};

  // ================= LISTA FILTRADA =================
  get listaFiltrada(): Recarga[] {
    let data = this.recargas();

    // status
    if (this.filtro !== 'todos') {
      data = data.filter(r => r.status === this.filtro);
    }

    // texto (nome/email)
    const termo = this.filtroTexto.toLowerCase().trim();
    if (termo) {
      data = data.filter(r =>
        (r.nome ?? '').toLowerCase().includes(termo) ||
        (r.email ?? '').toLowerCase().includes(termo)
      );
    }

    // data (YYYY-MM-DD)
    if (this.filtroData) {
      data = data.filter(r => {
        const dataRecarga = new Date(r.data as any)
          .toISOString()
          .split('T')[0];

        return dataRecarga === this.filtroData;
      });
    }

    return data;
  }

  // ================= PAGINAÇÃO FINAL =================
  get totalPaginas(): number {
    return Math.ceil(this.listaFiltrada.length / this.porPagina);
  }

  get listaPaginada(): Recarga[] {
    const start = (this.pagina - 1) * this.porPagina;
    return this.listaFiltrada.slice(start, start + this.porPagina);
  }

  mudarPagina(p: number) {
    this.pagina = p;
  }

  // ================= AÇÕES =================
  aprovar(id: string) {
    this.recargaService.aprovarRecarga(id);
  }

  rejeitar(id: string) {
    this.recargaService.rejeitarRecarga(id);
  }

  adicionarSaldo(email: string) {
    const valor = this.valoresSaldo[email] ?? 0;
    if (valor <= 0) return;

    this.auth.adicionarSaldoUsuario(email, valor);
    this.valoresSaldo[email] = 0;
  }

  getSaldo(email: string): number {
    const usuarios = JSON.parse(localStorage.getItem('vejate_users') || '[]');
    const user = usuarios.find((u: any) => u.email === email);

    return user?.saldo ?? 0;
  }
}