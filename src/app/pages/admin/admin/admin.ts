import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ReceitaService, EtapaPreparo } from '../../../services/receita.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html'
})
export class AdminComponent {

  private router = inject(Router);
  private auth = inject(AuthService);
  private receitaService = inject(ReceitaService);

  // View atual: dashboard ou receitas
  view = signal<'dashboard' | 'receitas' | 'admin/dashboard'>('dashboard');

  // Form fields
  titulo = '';
  descricao = '';
  categoria = '';
  modoPreparo: EtapaPreparo[] = [];
  etapaDescricao = '';
  etapaMedida = '';
  editId: number | null = null;

  // Lista de receitas
  receitas = this.receitaService.receitas;

  // Computed: total de receitas
  totalReceitas = computed(() => this.receitas().length);

  // Alterna view
  setView(tipo: 'dashboard' | 'receitas' | 'admin/dashboard') {
    this.view.set(tipo);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  /** Adiciona etapa de preparo ao formulário */
  adicionarEtapa() {
    if (!this.etapaDescricao.trim()) return;

    this.modoPreparo.push({
      descricao: this.etapaDescricao,
      medida: this.etapaMedida || undefined
    });

    this.etapaDescricao = '';
    this.etapaMedida = '';
  }

  /** Remove etapa pelo índice */
  removerEtapa(index: number) {
    this.modoPreparo.splice(index, 1);
  }

  /** Prepara a edição de uma receita existente */
  editar(receita: any) {
    this.editId = receita.id;
    this.titulo = receita.titulo;
    this.descricao = receita.descricao;
    this.categoria = receita.categoria;
    this.modoPreparo = [...receita.modoPreparo]; // copia para edição
  }

  /** Salva receita nova ou atualiza existente */
  salvar() {
    if (!this.titulo.trim() || !this.descricao.trim() || !this.categoria || this.modoPreparo.length === 0) return;

    const receitaCompleta = {
      titulo: this.titulo,
      descricao: this.descricao,
      categoria: this.categoria,
      modoPreparo: this.modoPreparo
    };

    if (this.editId !== null) {
      this.receitaService.editar({ id: this.editId, ...receitaCompleta });
    } else {
      this.receitaService.adicionar(receitaCompleta);
    }

    this.cancelar();
  }

  /** Cancela edição e limpa formulário */
  cancelar() {
    this.editId = null;
    this.titulo = '';
    this.descricao = '';
    this.categoria = '';
    this.modoPreparo = [];
    this.etapaDescricao = '';
    this.etapaMedida = '';
  }

  /** Remove receita pelo id */
  remover(id: number) {
    this.receitaService.remover(id);
  }

 

irParaRecargas() {
  this.router.navigate(['/admin/dashboard']);
}
}
