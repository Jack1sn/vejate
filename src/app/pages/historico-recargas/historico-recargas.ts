import { Component, inject } from '@angular/core';
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
export class HistoricoRecargasComponent {

  private auth = inject(AuthService);
  private recargaService = inject(RecargaService);

  filtroStatus: 'todos' | 'aprovado' | 'pendente' | 'rejeitado' = 'todos';

  filtroUsuario: string = ''; // 🔥 admin filtra por email/nome

  get usuario() {
    return this.auth.getUsuario();
  }

  get isAdmin(): boolean {
    return this.usuario?.role === 'admin';
  }

  get recargas(): Recarga[] {

    let lista = this.recargaService.getRecargasPorStatus();

    // 👤 CLIENTE vê só as dele
    if (!this.isAdmin) {
      lista = lista.filter(r => r.email === this.usuario?.email);
    }

    // 🧑‍💼 ADMIN pode filtrar usuário
    if (this.isAdmin && this.filtroUsuario.trim()) {
      const f = this.filtroUsuario.toLowerCase();

      lista = lista.filter(r =>
        r.email.toLowerCase().includes(f) ||
        r.nome.toLowerCase().includes(f)
      );
    }

    // 📌 filtro status (ambos)
    if (this.filtroStatus !== 'todos') {
      lista = lista.filter(r => r.status === this.filtroStatus);
    }

    return lista.sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
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
  imprimirRecarga(r: any) {
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

compartilharWhatsApp(r: any) {
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