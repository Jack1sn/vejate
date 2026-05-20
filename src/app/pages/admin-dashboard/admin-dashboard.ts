import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RecargaService } from '../../services/recarga.service';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { Recarga } from '../../models/recarga.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent {

  private recargaService = inject(RecargaService);
  private usuarioService = inject(UsuarioService);

  // ================= STATE =================
  recargas = signal<Recarga[]>([]);
  usuarios = signal<Usuario[]>([]);

  valoresSaldo = signal<Record<string, number>>({});
  usuarioSelecionado: Usuario | null = null;
  
  buscaEmail: string = '';
  usuariosFiltrados: any[] = [];
  






  // ✅ MENU STATUS
  menuStatusAberto: string | null = null;

  constructor() {
    this.carregarRecargas();
    this.carregarUsuarios();
  }

  // ================= LOAD =================
  carregarRecargas() {
    this.recargaService.listar().subscribe({
      next: (data) => this.recargas.set(data),
      error: (err) => console.error('Erro recargas', err)
    });
  }

  carregarUsuarios() {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios.set(
          data.map(u => ({
            ...u,
            saldo: Number(u.saldo ?? 0)
          }))
        );
      },
      error: (err) => console.error('Erro usuarios', err)
    });
  }

  // ================= FILTROS =================
  filtro: 'todos' | 'PENDENTE' | 'APROVADO' | 'REJEITADO' = 'todos';

  filtroTexto = '';
  filtroData = '';

  listaFiltrada = computed(() => {

    let data = this.recargas();

    // STATUS
    if (this.filtro !== 'todos') {
      data = data.filter(r => r.status === this.filtro);
    }

    // TEXTO
    const termo = this.filtroTexto.toLowerCase().trim();

    if (termo) {
      data = data.filter(r =>
        (r.nome ?? '').toLowerCase().includes(termo) ||
        (r.email ?? '').toLowerCase().includes(termo)
      );
    }

    // DATA
    if (this.filtroData) {
      data = data.filter(r =>
        new Date(r.data).toISOString().split('T')[0] === this.filtroData
      );
    }

    return data;
  });

  // ================= PAGINAÇÃO =================
  pagina = signal(1);

  porPagina = 5;

  totalPaginas = computed(() =>
    Math.max(
      1,
      Math.ceil(this.listaFiltrada().length / this.porPagina)
    )
  );

  paginas = computed(() =>
    Array.from(
      { length: this.totalPaginas() },
      (_, i) => i + 1
    )
  );

  listaPaginada = computed(() => {

    const page = this.pagina();

    const start = (page - 1) * this.porPagina;

    return this.listaFiltrada().slice(
      start,
      start + this.porPagina
    );
  });

  mudarPagina(p: number) {
    this.pagina.set(p);
  }

  // ================= MENU STATUS =================
  toggleMenuStatus(id: string) {

    this.menuStatusAberto =
      this.menuStatusAberto === id
        ? null
        : id;
  }

  // ================= RECARGA =================
 alterarStatus(
  event: Event,
  id: string,
  novoStatus: 'PENDENTE' | 'APROVADO' | 'REJEITADO'
) {

  event.preventDefault();

  this.recargaService
    .alterarStatus(id, novoStatus)
    .subscribe({

      next: () => {

        // fecha menu
        this.menuStatusAberto = null;

        // recarrega dados
        this.carregarRecargas();

        this.carregarUsuarios();
      },

      error: (err) => {

        console.error(
          'Erro alterar status',
          err
        );
      }
    });
}

  // ================= SALDO =================
  getSaldo(id: string): number {
    return this.usuarios()
      .find(u => u.id === id)?.saldo ?? 0;
  }

  atualizarSaldoTemp(id: string, valor: number) {

    this.valoresSaldo.set({
      ...this.valoresSaldo(),
      [id]: Number(valor)
    });
  }

 adicionarSaldo(id: string) {

  const valor = Number(this.valoresSaldo()[id] ?? 0);

  if (!valor || valor <= 0) return;

  this.usuarioService.adicionarSaldo(id, valor).subscribe({
    next: () => {

      // reseta apenas o valor daquele usuário
      this.valoresSaldo.set({
        ...this.valoresSaldo(),
        [id]: 0
      });

      this.carregarUsuarios();
    },

    error: (err) =>
      console.error('Erro ao adicionar saldo', err)
  });
}

filtrarUsuarios() {
  const termo = (this.buscaEmail ?? '').toLowerCase();

  const usuarios = this.usuarios?.() ?? [];

  this.usuariosFiltrados = usuarios.filter(u =>
    (u.email ?? '').toLowerCase().includes(termo)
  );
}
selecionarUsuario(usuario: any) {
  this.usuarioSelecionado = usuario;
  this.usuariosFiltrados = [];
  this.buscaEmail = usuario.email;
}


}