import { Injectable, signal, computed } from '@angular/core';

export interface Usuario {
  email: string;
  role: 'admin' | 'cliente';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_KEY = 'vejate_user';

  // Signal reativo (Angular 16+)
  private usuarioSignal = signal<Usuario | null>(this.getUsuarioFromStorage());

  // Computed helpers
  usuario = computed(() => this.usuarioSignal());
  estaLogado = computed(() => !!this.usuarioSignal());
  ehAdmin = computed(() => this.usuarioSignal()?.role === 'admin');

  constructor() {}

  /**
   * 🔐 Login simples (exemplo)
   */
  login(email: string, senha: string) {

    let usuario: Usuario;

    if (email === 'admin@vejate.com') {
      usuario = { email, role: 'admin' };
    } else {
      usuario = { email, role: 'cliente' };
    }

    this.usuarioSignal.set(usuario);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
  }

  /**
   * 🚪 Logout
   */
  logout() {
    this.usuarioSignal.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 👤 Recupera usuário do localStorage
   */
  private getUsuarioFromStorage(): Usuario | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * 👀 Método clássico (caso precise no guard)
   */
  getUsuario(): Usuario | null {
    return this.usuarioSignal();
  }

}
