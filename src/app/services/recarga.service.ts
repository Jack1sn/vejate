import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recarga } from '../models/recarga.model';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {

  private readonly API = 'http://localhost:8080/api/recarga';

  constructor(private http: HttpClient) {}

  // 🔐 headers com JWT
  private getAuthHeaders(): HttpHeaders {

    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('⚠️ Token não encontrado no localStorage');

      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  // 💳 CRIAR RECARGA (CORRIGIDO)
  solicitarRecarga(valor: number): Observable<Recarga> {

    return this.http.post<Recarga>(
      this.API,
      { valor }, // 🔥 backend pega email do token
      { headers: this.getAuthHeaders() }
    );
  }

  // 📊 LISTAR TODAS
  listar(): Observable<Recarga[]> {

    return this.http.get<Recarga[]>(
      this.API,
      { headers: this.getAuthHeaders() }
    );
  }

  // 📊 FILTRAR POR STATUS
  listarPorStatus(status: string): Observable<Recarga[]> {

    return this.http.get<Recarga[]>(
      `${this.API}?status=${status}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ✅ APROVAR
  aprovarRecarga(id: string): Observable<Recarga> {

    return this.http.put<Recarga>(
      `${this.API}/${id}/aprovar`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // ❌ REJEITAR
  rejeitarRecarga(id: string): Observable<Recarga> {

    return this.http.put<Recarga>(
      `${this.API}/${id}/rejeitar`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}