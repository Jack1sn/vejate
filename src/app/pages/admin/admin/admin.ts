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

  // 📌 view atual
  view = signal<'dashboard' | 'receitas' | 'admin/dashboard'>('dashboard');

  // 📌 form
  titulo = '';
  descricao = '';
  categoria = '';
  modoPreparo: EtapaPreparo[] = [];
  etapaDescricao = '';
  etapaMedida = '';
  editId: number | null = null;

  // 📌 receitas (garantindo tipo seguro)
  receitas = this.receitaService.receitas;

  // 📊 total receitas
  totalReceitas = computed(() => this.receitas().length ?? 0);

  // 🔄 troca view
  setView(tipo: 'dashboard' | 'receitas' | 'admin/dashboard') {
    this.view.set(tipo);
  }

  // 🚪 logout
  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  /** ➕ adiciona etapa */
  adicionarEtapa() {
    if (!this.etapaDescricao.trim()) return;

    this.modoPreparo.push({
      descricao: this.etapaDescricao,
      medida: this.etapaMedida || undefined
    });

    this.etapaDescricao = '';
    this.etapaMedida = '';
  }

  /** ❌ remove etapa */
  removerEtapa(index: number) {
    this.modoPreparo.splice(index, 1);
  }

  /** ✏️ editar receita (TIPADO CORRETO) */
  editar(receita: {
    id: number;
    titulo: string;
    descricao: string;
    categoria: string;
    modoPreparo: EtapaPreparo[];
  }) {
    this.editId = receita.id;
    this.titulo = receita.titulo;
    this.descricao = receita.descricao;
    this.categoria = receita.categoria;
    this.modoPreparo = [...receita.modoPreparo];
  }

  /** 💾 salvar */
  salvar() {
    if (
      !this.titulo.trim() ||
      !this.descricao.trim() ||
      !this.categoria ||
      this.modoPreparo.length === 0
    ) return;

    const receitaCompleta = {
      titulo: this.titulo,
      descricao: this.descricao,
      categoria: this.categoria,
      modoPreparo: this.modoPreparo
    };

    if (this.editId !== null) {
      this.receitaService.editar({
        id: this.editId,
        ...receitaCompleta
      });
    } else {
      this.receitaService.adicionar(receitaCompleta);
    }

    this.cancelar();
  }

  /** 🧹 reset */
  cancelar() {
    this.editId = null;
    this.titulo = '';
    this.descricao = '';
    this.categoria = '';
    this.modoPreparo = [];
    this.etapaDescricao = '';
    this.etapaMedida = '';
  }

  /** 🗑 remover */
  remover(id: number) {
    this.receitaService.remover(id);
  }

  // 🔁 navegação
  irParaRecargas() {
    this.router.navigate(['/admin/dashboard']);
  }

  irParaHistRecargas() {
    this.router.navigate(['/historico-recargas']);
  }
}