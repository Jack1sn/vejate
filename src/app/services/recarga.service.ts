import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recarga } from '../models/recarga.model';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {

  private API = 'http://localhost:8080/api/recargas';

  constructor(private http: HttpClient) {}

  // 💳 criar recarga
  solicitarRecarga(valor: number, email: string, nome: string): Observable<Recarga> {
    return this.http.post<Recarga>(this.API, {
      valor,
      email,
      nome
    });
  }

  // 📊 listar todas
  listar(): Observable<Recarga[]> {
    return this.http.get<Recarga[]>(this.API);
  }

  // 📊 filtrar por status (frontend ou backend)
  listarPorStatus(status: string): Observable<Recarga[]> {
    return this.http.get<Recarga[]>(`${this.API}?status=${status}`);
  }

  // ✅ aprovar
  aprovarRecarga(id: string): Observable<Recarga> {
    return this.http.put<Recarga>(`${this.API}/${id}/aprovar`, {});
  }

  // ❌ rejeitar
  rejeitarRecarga(id: string): Observable<Recarga> {
    return this.http.put<Recarga>(`${this.API}/${id}/rejeitar`, {});
  }
}