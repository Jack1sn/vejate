import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: string; // UUID
  nome?: string;
  email?: string;
  role: 'ADMIN' | 'CLIENTE' | string;
  saldo: number;
  token?: string;
}

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  cep?: string;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private API = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  // =========================
  // 🔐 PEGAR TOKEN
  // =========================
  private getToken(): string | null {
    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
      return JSON.parse(user)?.token ?? null;
    } catch {
      return null;
    }
  }

  // =========================
  // 🔐 HEADERS COM TOKEN (se houver)
  // =========================
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // =========================
  // 📝 CADASTRAR USUÁRIO (SEM TOKEN)
  // =========================
  cadastrar(usuario: UsuarioRequest): Observable<Usuario> {
    // Cadastro não precisa de token
    return this.http.post<Usuario>(this.API, usuario);
  }

  // =========================
  // 🔐 LOGIN USUÁRIO (SEM TOKEN)
  // =========================
  login(email: string, senha: string): Observable<{ usuario: Usuario, token: string }> {
    return this.http.post<{ usuario: Usuario, token: string }>(
      `${this.API}/login`,
      { email, senha }
    );
  }

  // =========================
  // 📊 LISTAR USUÁRIOS (COM TOKEN)
  // =========================
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API, { headers: this.getAuthHeaders() });
  }

  // =========================
  // 🔍 BUSCAR POR UUID (COM TOKEN)
  // =========================
  buscarPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/${id}`, { headers: this.getAuthHeaders() });
  }

  // =========================
  // 💰 ADICIONAR SALDO (COM TOKEN)
  // =========================
  adicionarSaldo(id: string, valor: number): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.API}/${id}/saldo`,
       valor ,
      { headers: this.getAuthHeaders() }
    );
  }

  // =========================
  // 👤 ME (USUÁRIO LOGADO)
  // =========================
  getMe(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/me`, { headers: this.getAuthHeaders() });
  }
}