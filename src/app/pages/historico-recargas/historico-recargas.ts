import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subject, switchMap, takeUntil, startWith } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { RecargaService } from '../../services/recarga.service';
import { Recarga } from '../../models/recarga.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-historico-recargas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historico-recargas.html'
})
export class HistoricoRecargasComponent implements OnInit, OnDestroy {

  private auth = inject(AuthService);
  private recargaService = inject(RecargaService);
  private destroy$ = new Subject<void>();

  lista: Recarga[] = [];
  recargasFiltradas: Recarga[] = [];

  filtroStatus: 'todos' | 'APROVADO' | 'PENDENTE' | 'REJEITADO' = 'todos';
  filtroUsuario: string = '';

  ultimaAtualizacao = new Date();

  // =========================
  // INIT AUTO REFRESH
  // =========================
  ngOnInit() {
    interval(600000) // 10 min
      .pipe(
        startWith(0),
        switchMap(() => this.recargaService.listar()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          this.lista = data;
          this.aplicarFiltros();
          this.ultimaAtualizacao = new Date();
        },
        error: (err) => console.error('Erro listar recargas', err)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // USER
  // =========================
  get usuario() {
    return this.auth.getUsuario();
  }

  get isAdmin(): boolean {
    return this.usuario?.role === 'ADMIN';
  }

  // =========================
  // FILTROS
  // =========================
  aplicarFiltros() {

    let lista = [...this.lista];

    // CLIENTE vê só dele
    if (!this.isAdmin) {
      lista = lista.filter(r => r.email === this.usuario?.email);
    }

    // ADMIN filtra por texto
    if (this.isAdmin && this.filtroUsuario.trim()) {
      const f = this.filtroUsuario.toLowerCase();
      lista = lista.filter(r =>
        (r.email ?? '').toLowerCase().includes(f) ||
        (r.nome ?? '').toLowerCase().includes(f)
      );
    }

    // STATUS
    if (this.filtroStatus !== 'todos') {
      lista = lista.filter(r => r.status === this.filtroStatus);
    }

    // ORDER BY DATA
    this.recargasFiltradas = lista.sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  // =========================
  // ALTERAR STATUS (ADMIN)
  // =========================
  alterarStatus(
    id: string,
    status: 'PENDENTE' | 'APROVADO' | 'REJEITADO'
  ) {
    this.recargaService.alterarStatus(id, status)
      .subscribe({
        next: () => {
          this.recargaService.listar().subscribe(data => {
            this.lista = data;
            this.aplicarFiltros();
          });
        },
        error: (err) => console.error('Erro ao alterar status', err)
      });
  }

  // =========================
  // UI HELPERS
  // =========================
  trackById(index: number, item: Recarga) {
    return item.id;
  }

  statusClass(status: string) {
    switch ((status || '').toLowerCase()) {
      case 'aprovado': return 'bg-green-100 text-green-700';
      case 'pendente': return 'bg-yellow-100 text-yellow-700';
      case 'rejeitado': return 'bg-red-100 text-red-700';
      default: return '';
    }
  }

  // =========================
  // PRINT
  // =========================
imprimirRecarga(r: Recarga) {

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Recibo de Recarga', 20, 20);

  doc.setFontSize(12);

  doc.text(`Nome: ${r.nome ?? 'N/A'}`, 20, 40);
  doc.text(`Email: ${r.email ?? 'N/A'}`, 20, 50);
  doc.text(`Valor: R$ ${Number(r.valor).toFixed(2)}`, 20, 60);
  doc.text(`Status: ${r.status}`, 20, 70);
  doc.text(`Data: ${new Date(r.data).toLocaleString()}`, 20, 80);

  doc.line(20, 90, 190, 90);

  doc.text('VEJATE - Sistema de Recargas', 20, 100);

  doc.save(`recarga-${r.id ?? 'recibo'}.pdf`);
}

  // =========================
  // SHARE
  // =========================
  compartilharRecarga(r: Recarga) {

    const texto =
`📄 Recarga VEJATE
👤 ${r.nome ?? 'N/A'}
📱 ${r.numero}
💰 R$ ${Number(r.valor).toFixed(2)}
📅 ${new Date(r.data).toLocaleString()}
📌 Status: ${r.status}`;

    if (navigator.share) {
      navigator.share({
        title: 'Recarga VEJATE',
        text: texto
      });
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
      window.open(url, '_blank');
    }
  }
}