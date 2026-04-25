import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private API = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  cadastrar(usuario: UsuarioRequest): Observable<any> {
    return this.http.post(this.API, usuario);
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
    
  }
}