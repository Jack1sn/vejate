import { Injectable, signal, computed } from '@angular/core';

export interface Usuario {
  email: string;
  senha: string;
  role: 'admin' | 'cliente';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_KEY = 'vejate_user';
  private readonly STORAGE_USERS = 'vejate_users';

  // Signal reativo para o usuário logado
  private usuarioSignal = signal<Usuario | null>(this.getUsuarioFromStorage());

  // Computed helpers
  usuario = computed(() => this.usuarioSignal());
  estaLogado = computed(() => !!this.usuarioSignal());
  ehAdmin = computed(() => this.usuarioSignal()?.role === 'admin');

  constructor() {
    // Inicializa a lista de usuários cadastrados com admin e cliente padrão
    const usuarios = this.getUsuariosCadastrados();

    // Admin padrão
    if (!usuarios.find(u => u.email === 'admin@vejate.com')) {
      this.salvarUsuario({ email: 'admin@vejate.com', senha: '123', role: 'admin' });
    }

    // Cliente padrão
    if (!usuarios.find(u => u.email === 'cliente@vejate.com')) {
      this.salvarUsuario({ email: 'cliente@vejate.com', senha: '123', role: 'cliente' });
    }
  }

  /**
   * 🔐 Login
   */
  login(email: string, senha: string): boolean {
    const usuarios = this.getUsuariosCadastrados();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (!usuario) return false;

    this.usuarioSignal.set(usuario);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
    return true;
  }

  /**
   * 🚪 Logout
   */
  logout() {
    this.usuarioSignal.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 📝 Cadastro de novo cliente
   */
  cadastrarCliente(email: string, senha: string): boolean {
    const usuarios = this.getUsuariosCadastrados();

    if (usuarios.find(u => u.email === email)) {
      return false; // email já existe
    }

    const novoUsuario: Usuario = { email, senha, role: 'cliente' };
    this.salvarUsuario(novoUsuario);
    return true;
  }

  /**
   * 👤 Recupera usuário logado
   */
  private getUsuarioFromStorage(): Usuario | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * 👥 Lista de usuários cadastrados
   */
  private getUsuariosCadastrados(): Usuario[] {
    const data = localStorage.getItem(this.STORAGE_USERS);
    return data ? JSON.parse(data) : [];
  }

  /**
   * 💾 Salva usuário na lista de usuários cadastrados
   */
  private salvarUsuario(usuario: Usuario) {
    const usuarios = this.getUsuariosCadastrados();
    usuarios.push(usuario);
    localStorage.setItem(this.STORAGE_USERS, JSON.stringify(usuarios));
  }

  /**
   * 👀 Método clássico
   */
  getUsuario(): Usuario | null {
    return this.usuarioSignal();
  }

}
