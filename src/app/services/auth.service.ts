import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface Usuario {
  id: string;
  nome?: string;
  email?: string;
  role: 'ADMIN' | 'CLIENTE';
  saldo: number;
  token?: string;
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

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('user');
    if (saved) {
      this.usuarioSignal.set(JSON.parse(saved));
    }
  }

  

login(email: string, senha: string) {
  return this.http.post<any>(`${this.API}/auth/login`, { email, senha })
    .pipe(
      tap(res => {

        console.log("LOGIN RESPONSE:", res);

        const token = res.token;
        const user = res.usuario;

        // 🚨 validação forte
        if (!token) {
          console.error("TOKEN NÃO VEIO");
          throw new Error("Token não recebido do backend");
        }

        // 🔥 salva token
        localStorage.setItem('token', token);

        const cleanUser = { ...user, id: String(user.id).trim() };

        this.usuarioSignal.set(cleanUser);
        localStorage.setItem('user', JSON.stringify(cleanUser));

        console.log("TOKEN SALVO:", token);
      })
    );
}
  logout() {
    this.usuarioSignal.set(null);
    localStorage.clear();
  }

  getUsuario(): Usuario | null {
    return this.usuarioSignal();
  }

  // 🔥 NOVO MÉTODO: atualizar saldo do usuário
  atualizarSaldo(novoSaldo: number) {
    const user = this.usuarioSignal();
    if (!user) return;
    const atualizado = { ...user, saldo: novoSaldo };
    this.usuarioSignal.set(atualizado);
    localStorage.setItem('user', JSON.stringify(atualizado));
  }
}