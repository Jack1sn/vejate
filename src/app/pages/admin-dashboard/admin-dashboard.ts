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

  filtro: 'todos' | 'pendente' | 'aprovado' | 'rejeitado' = 'todos';

  // 💰 controle de saldo manual por usuário
  valoresSaldo: { [email: string]: number } = {};

  get listaFiltrada(): Recarga[] {
    const data = this.recargas();

    if (this.filtro === 'todos') return data;

    return data.filter(r => r.status === this.filtro);
  }

  aprovar(id: string) {
    this.recargaService.aprovarRecarga(id);
  }

  rejeitar(id: string) {
    this.recargaService.rejeitarRecarga(id);
  }

  // 💰 ADICIONAR SALDO MANUAL
  adicionarSaldo(email: string) {
    const valor = this.valoresSaldo[email] ?? 0;

    if (valor <= 0) return;

    this.auth.adicionarSaldoUsuario(email, valor);

    this.valoresSaldo[email] = 0;
  }

  // 👤 pegar saldo do usuário
  getSaldo(email: string): number {
    const usuarios = JSON.parse(localStorage.getItem('vejate_users') || '[]');
    const user = usuarios.find((u: any) => u.email === email);

    return user?.saldo ?? 0;
  }
}