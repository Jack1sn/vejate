import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: string;
  nome: string;
  email: string;
  role: 'ADMIN' | 'CLIENTE' | string;
  saldo: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://localhost:8080/api';

  private usuarioSignal = signal<Usuario | null>(null);

  usuario = computed(() => this.usuarioSignal());
  estaLogado = computed(() => !!this.usuarioSignal());
  ehAdmin = computed(() => this.usuarioSignal()?.role === 'ADMIN');
  nomeUsuario = computed(() => this.usuarioSignal());

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('user');
    if (saved) {
      this.usuarioSignal.set(JSON.parse(saved));
    }
  }

  // ================= LOGIN =================
  login(email: string, senha: string) {
    return this.http.post<Usuario>(
      `${this.API}/auth/login`,
      { email, senha }
    ).pipe(
      tap(user => {
        this.usuarioSignal.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  // ================= LOGOUT =================
  logout() {
    this.usuarioSignal.set(null);
    localStorage.removeItem('user');
  }

  // ================= GET =================
  getUsuario(): Usuario | null {
    return this.usuarioSignal();
  }

  // ================= SALDO (BACKEND) =================

  // ➕ adicionar saldo (admin)
  adicionarSaldoUsuario(email: string, valor: number): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.API}/usuarios/saldo`,
      { email, valor }
    ).pipe(
      tap(userAtualizado => {
        // atualiza local se for o mesmo usuário logado
        const atual = this.usuarioSignal();
        if (atual?.email === email) {
          this.usuarioSignal.set(userAtualizado);
          localStorage.setItem('user', JSON.stringify(userAtualizado));
        }
      })
    );
  }

  // 🔄 atualizar usuário do backend (sync)
  atualizarUsuario(): Observable<Usuario> {
    const user = this.usuarioSignal();
    if (!user?.email) throw new Error('Usuário não logado');

    return this.http.get<Usuario>(
      `${this.API}/usuarios/email/${user.email}`
    ).pipe(
      tap(u => {
        this.usuarioSignal.set(u);
        localStorage.setItem('user', JSON.stringify(u));
      })
    );
  }
}