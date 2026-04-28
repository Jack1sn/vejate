import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer";
import { UsuarioService } from '../../services/usuario.service';

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

  constructor(private http: HttpClient, private router: Router,
     private usuarioService: UsuarioService ) {}

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

  const novoUsuario = {
    nome: this.nome,
    email: this.email,
    senha: '$2a$10$YRP/CnbL/cKy8nVUf1jQhul0dNuYfY09YP3uLBhtRTv9Sx1.yTJw.',
    cep: this.cep,
    logradouro: this.logradouro,
    bairro: this.bairro,
    cidade: this.cidade,
    estado: this.estado
  };

  this.usuarioService.cadastrar(novoUsuario).subscribe({
    next: () => {

      // 🔥 mostra sucesso primeiro
      this.mensagem = 'Cadastro realizado com sucesso! Redirecionando para login...';

      // limpa erro
      this.erro = '';

      // ⏳ espera usuário ver a mensagem
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3500);

    },
    error: (err) => {
      this.erro = err.error?.message || 'Erro ao cadastrar usuário';
      this.mensagem = '';
    }
  });

  
}



}