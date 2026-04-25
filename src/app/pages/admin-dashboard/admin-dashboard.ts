import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecargaService } from '../../services/recarga.service';
import { AuthService } from '../../services/auth.service';
import { Recarga } from '../../models/recarga.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent {

  private recargaService = inject(RecargaService);
  private auth = inject(AuthService);

  // ================= STATE (API) =================
  recargas = signal<Recarga[]>([]);
  usuarioService: any;

  constructor() {
    this.carregar();
  }

  carregar() {
    this.recargaService.listar().subscribe({
      next: (data) => this.recargas.set(data),
      error: (err) => console.error('Erro ao carregar recargas', err)
    });
  }

  // ================= FILTROS =================
  filtro: 'todos' | 'pendente' | 'aprovado' | 'rejeitado' = 'todos';
  filtroTexto = '';
  filtroData: string = '';

  // ================= PAGINAÇÃO =================
  pagina = 1;
  porPagina = 5;

  valoresSaldo: { [email: string]: number } = {};

  // ================= LISTA FILTRADA =================
  listaFiltrada = computed(() => {
    let data = this.recargas();

    // status
    if (this.filtro !== 'todos') {
      data = data.filter((r: Recarga) => r.status === this.filtro);
    }

    // texto
    const termo = this.filtroTexto.toLowerCase().trim();
    if (termo) {
      data = data.filter((r: Recarga) =>
        (r.nome ?? '').toLowerCase().includes(termo) ||
        (r.email ?? '').toLowerCase().includes(termo)
      );
    }

    // data
    if (this.filtroData) {
      data = data.filter((r: Recarga) => {
        const dataRecarga = new Date(r.data).toISOString().split('T')[0];
        return dataRecarga === this.filtroData;
      });
    }

    return data;
  });

  // ================= PAGINAÇÃO =================
  totalPaginas = computed(() =>
    Math.ceil(this.listaFiltrada().length / this.porPagina)
  );

  listaPaginada = computed(() => {
    const start = (this.pagina - 1) * this.porPagina;
    return this.listaFiltrada().slice(start, start + this.porPagina);
  });

  mudarPagina(p: number) {
    this.pagina = p;
  }

  // ================= AÇÕES BACKEND =================
  aprovar(id: string) {
    this.recargaService.aprovarRecarga(id).subscribe({
      next: () => this.carregar()
    });
  }

  rejeitar(id: string) {
    this.recargaService.rejeitarRecarga(id).subscribe({
      next: () => this.carregar()
    });
  }

  adicionarSaldo(email: string) {
    const valor = this.valoresSaldo[email] ?? 0;
    if (valor <= 0) return;

   this.usuarioService.adicionarSaldo(email, valor).subscribe();
    this.valoresSaldo[email] = 0;
  }

  // ================= SALDO =================
  getSaldo(email: string): number {
    const usuarios = JSON.parse(localStorage.getItem('vejate_users') || '[]');
    const user = usuarios.find((u: any) => u.email === email);

    return user?.saldo ?? 0;
  }
}