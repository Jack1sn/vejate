import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RecargaService } from '../../services/recarga.service';
import { Recarga } from '../../models/recarga.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historico-recargas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historico-recargas.html'
})
export class HistoricoRecargasComponent implements OnInit {

  private auth = inject(AuthService);
  private recargaService = inject(RecargaService);

  lista: Recarga[] = [];

  filtroStatus: 'todos' | 'aprovado' | 'pendente' | 'rejeitado' = 'todos';
  filtroUsuario: string = '';

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.recargaService.listar().subscribe({
      next: (data) => {
        this.lista = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  get usuario() {
    return this.auth.getUsuario();
  }

  get isAdmin(): boolean {
    return this.usuario?.role === 'ADMIN';
  }

  // 🔥 AGORA FILTRA EM CIMA DA LISTA VINDO DA API
  get recargas(): Recarga[] {

    let lista = [...this.lista];

    // 👤 cliente vê só as dele
    if (!this.isAdmin) {
      lista = lista.filter((r: Recarga) => r.email === this.usuario?.email);
    }

    // 🧑‍💼 admin filtra usuário
    if (this.isAdmin && this.filtroUsuario.trim()) {
      const f = this.filtroUsuario.toLowerCase();

      lista = lista.filter((r: Recarga) =>
        r.email.toLowerCase().includes(f) ||
        r.nome.toLowerCase().includes(f)
      );
    }

    // 📌 filtro status
    if (this.filtroStatus !== 'todos') {
      lista = lista.filter((r: Recarga) => r.status === this.filtroStatus);
    }

    // 📅 ordenação
    return lista.sort((a: Recarga, b: Recarga) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  statusClass(status: string) {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-700';
      case 'pendente': return 'bg-yellow-100 text-yellow-700';
      case 'rejeitado': return 'bg-red-100 text-red-700';
      default: return '';
    }
  }

  imprimirRecarga(r: Recarga) {
    const janela = window.open('', '_blank');
    if (!janela) return;

    janela.document.write(`
      <html>
        <head>
          <title>Recibo</title>
        </head>
        <body style="font-family: Arial; padding: 20px;">
          <h2>Recibo de Recarga</h2>
          <p><strong>Nome:</strong> ${r.nome}</p>
          <p><strong>Email:</strong> ${r.email}</p>
          <p><strong>Valor:</strong> R$ ${Number(r.valor).toFixed(2)}</p>
          <p><strong>Status:</strong> ${r.status}</p>
          <p><strong>Data:</strong> ${new Date(r.data).toLocaleString()}</p>
          <hr />
          <p>VEJATE - Sistema de Recargas</p>
        </body>
      </html>
    `);

    janela.document.close();
    janela.print();
  }

  compartilharWhatsApp(r: Recarga) {
    const texto =
`📄 Recarga VEJATE
👤 ${r.nome}
💰 R$ ${Number(r.valor).toFixed(2)}
📅 ${new Date(r.data).toLocaleString()}
📌 Status: ${r.status}`;

    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  }
}