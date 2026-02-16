import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ReceitaService } from '../../../services/receita.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html'  // HTML separado
})
export class AdminComponent {

  private router = inject(Router);
  private auth = inject(AuthService);
  private receitaService = inject(ReceitaService);

  // Sinal para dashboard/receitas
  view = signal<'dashboard' | 'receitas'>('dashboard');

  // Form fields
  titulo = '';
  descricao = '';
  categoria = '';
  editId: number | null = null;

  // Lista de receitas
  receitas = this.receitaService.receitas;

  // Computed para total
  totalReceitas = computed(() => this.receitas().length);

  setView(tipo: 'dashboard' | 'receitas') {
    this.view.set(tipo);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  salvar() {
    if (!this.titulo || !this.descricao || !this.categoria) return;

   if (this.editId !== null) {
  this.receitaService.editar({
    id: this.editId,
    titulo: this.titulo,
    descricao: this.descricao,
    categoria: this.categoria
  });
}
 else {
      this.receitaService.adicionar({
        titulo: this.titulo,
        descricao: this.descricao,
        categoria: this.categoria
      });
    }

    this.cancelar();
  }

  editar(receita: any) {
    this.editId = receita.id;
    this.titulo = receita.titulo;
    this.descricao = receita.descricao;
    this.categoria = receita.categoria;
  }

  cancelar() {
    this.editId = null;
    this.titulo = '';
    this.descricao = '';
    this.categoria = '';
  }

  remover(id: number) {
    this.receitaService.remover(id);
  }
}
