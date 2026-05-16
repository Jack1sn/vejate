import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer";
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, RouterModule],
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

  carregando = false;

  // 🔥 senha fixa para testes (mantida como você pediu)
  private senhaTeste = '123456';

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  // =========================
  // BUSCAR CEP
  // =========================
  buscarCep() {
    this.cep = this.cep.replace(/\D/g, '');

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

  // =========================
  // REGISTRAR
  // =========================
  registrar() {

    if (!this.nome || !this.email || !this.cep) {
      this.erro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.mensagem = '';

    const novoUsuario = {
      nome: this.nome,
      email: this.email,
      senha: this.senhaTeste, // 🔥 senha fixa para testes
      cep: this.cep,
      logradouro: this.logradouro,
      bairro: this.bairro,
      cidade: this.cidade,
      estado: this.estado
    };

    this.usuarioService.cadastrar(novoUsuario).subscribe({
      next: () => {

        this.mensagem = 'Cadastro realizado com sucesso! Redirecionando para login...';

        this.carregando = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);

      },
      error: (err) => {
        this.erro = err.error?.message || 'Erro ao cadastrar usuário';
        this.carregando = false;
      }
    });
  }
}