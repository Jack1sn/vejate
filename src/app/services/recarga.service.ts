import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recarga } from '../models/recarga.model';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {

  private API = 'http://localhost:8080/api/recarga';

  constructor(private http: HttpClient) {}

  // =========================
  // 🔐 PEGAR TOKEN DO LOCALSTORAGE
  // =========================
  private getToken(): string | null {

    const user = localStorage.getItem('user');

    if (!user) return null;

    try {
      return JSON.parse(user)?.token ?? null;
    } catch (e) {
      console.error('Erro ao ler user do localStorage', e);
      return null;
    }
  }

  // =========================
  // 🔐 HEADERS COM JWT
  // =========================
  private getAuthHeaders(): HttpHeaders {

    const token = this.getToken();

    console.log('🔐 TOKEN ENVIADO:', token);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // =========================
  // 💰 CRIAR RECARGA (SEM usuarioId)
  // =========================
solicitarRecarga(body: {
  numero: string;
  valor: number;
  moeda: string;
  origem: string;
  comprovante?: string | null;
}): Observable<Recarga> {

  const payload = {
    ...body
  };

  console.log('📤 ENVIANDO RECARGA:', payload);

  return this.http.post<Recarga>(
    this.API,
    payload,
    { headers: this.getAuthHeaders() }
  );
}

  // =========================
  // 📋 LISTAR RECARGAS
  // =========================
  listar(): Observable<Recarga[]> {
    return this.http.get<Recarga[]>(
      this.API,
      { headers: this.getAuthHeaders() }
    );
  }

  // =========================
  // ✅ APROVAR RECARGA ...
  // =========================
  alterarStatus(
  id: string,
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO'
): Observable<Recarga> {

  return this.http.put<Recarga>(
    `${this.API}/${id}/status`,
    { status },
    { headers: this.getAuthHeaders() }
  );
}


  
}