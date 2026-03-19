import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, FooterComponent,RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {

  nome = '';
  email = '';
  cep = '';
  logradouro = '';
  bairro = '';
  cidade = '';
  estado = '';

  mensagem = '';
  erro = '';

  redirecionando = false;
  contador = 60;
  intervalo: any;

  constructor(private http: HttpClient, private router: Router) {}

  buscarCep() {
    if (this.cep.length !== 8) {
      this.erro = 'CEP deve conter 8 números.';
      return;
    }

    this.erro = '';

    this.http.get<any>(`https://viacep.com.br/ws/${this.cep}/json/`)
      .subscribe({
        next: (dados) => {
          if (dados.erro) {
            this.erro = 'CEP não encontrado.';
            return;
          }

          this.logradouro = dados.logradouro;
          this.bairro = dados.bairro;
          this.cidade = dados.localidade;
          this.estado = dados.uf;
        },
        error: () => {
          this.erro = 'Erro ao buscar CEP.';
        }
      });
  }

  registrar() {
    if (!this.nome || !this.email || !this.cep) {
      this.erro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.erro = '';
    this.mensagem =
      'Cadastro realizado com sucesso! Uma senha temporária foi enviada para o email informado.';

    this.redirecionando = true;

    // Inicia contador regressivo
    this.intervalo = setInterval(() => {
      this.contador--;

      if (this.contador === 0) {
        clearInterval(this.intervalo);
        this.router.navigate(['/login']);
      }
    }, 200);
  }
}