import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { AuthService } from '../../services/auth.service';
import { RecargaService } from '../../services/recarga.service';

@Component({
  selector: 'app-credito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credito.html',
})
export class CreditoComponent {

  private auth = inject(AuthService);
  private recargaService = inject(RecargaService);

  numero = '';
  numeroValido = false;
  paisDetectado = '';
  paisSelecionado = '';

  mensagem = '';
  tipoMensagem: 'success' | 'error' | '' = '';

  valores = [15,20,25,30,35,40,50,60,70,80,90,100];

  paises = [
    { codigo: 'DO', nome: 'República Dominicana 🇩🇴', moeda: 'DOP', taxa: 11.89 },
    { codigo: 'HT', nome: 'Haiti 🇭🇹', moeda: 'HTG', taxa: 26.29 },
    { codigo: 'CU', nome: 'Cuba 🇨🇺', moeda: 'CUP', taxa: 4.85 },
    { codigo: 'VE', nome: 'Venezuela 🇻🇪', moeda: 'VES', taxa: 8.5 }
  ];

  validarNumero() {
    const phone = parsePhoneNumberFromString(this.numero);

    if (phone && phone.isValid()) {
      this.numeroValido = true;
      this.paisDetectado = phone.country || '';
      this.paisSelecionado = this.paisDetectado;
    } else {
      this.numeroValido = false;
      this.paisDetectado = '';
    }
  }

  get paisAtual() {
    return this.paises.find(p => p.codigo === this.paisSelecionado);
  }

  converter(valor: number): number {
    if (!this.paisAtual) return 0;
    return valor * this.paisAtual.taxa;
  }

  get saldo(): number {
    return this.auth.usuario()?.saldo ?? 0;
  }

 processando = false; // lock para o processo

pagar(valor: number) {

  if (this.processando) return; // 🚫 evita duplicação
  this.processando = true;

  if (!this.numeroValido) {
    this.mostrarErro('Número inválido');
    this.processando = false;
    return;
  }

  const user = this.auth.usuario();

  if (!user) {
    this.mostrarErro('Usuário não autenticado');
    this.processando = false;
    return;
  }

  if (user.saldo < valor) {
    this.mostrarErro('Saldo insuficiente');
    this.processando = false;
    return;
  }

  // ✅ desconta saldo
 // this.auth.adicionarSaldoUsuario(user.email, -valor);

  // ✅ envia recarga
  this.recargaService.solicitarRecarga(valor);

  this.mostrarSucesso(`Recarga enviada com sucesso! Valor: R$ ${this.formatar(valor)}`);

  this.limparFormulario();

  setTimeout(() => {
    this.processando = false;
  }, 1000);
}

  mostrarSucesso(msg: string) {
    this.tipoMensagem = 'success';
    this.mensagem = msg;
    this.autoFechar();
  }

  mostrarErro(msg: string) {
    this.tipoMensagem = 'error';
    this.mensagem = msg;
    this.autoFechar();
  }

  autoFechar() {
    setTimeout(() => {
      this.mensagem = '';
    }, 4000);
  }

  private limparFormulario() {
    this.numero = '';
    this.numeroValido = false;
    this.paisDetectado = '';
    this.paisSelecionado = '';
  }

  getBandeira(codigo: string): string {
    if (!codigo) return '';

    return codigo
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );
  }

  formatar(valor: number): string {
    return valor.toFixed(2);
  }
}