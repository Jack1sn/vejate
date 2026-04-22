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

  valores = [15,20,25,30,35,40,50,60,70,80,90,100];

  paises = [
    { codigo: 'DO', nome: 'República Dominicana 🇩🇴', moeda: 'DOP', taxa: 11.89 },
    { codigo: 'HT', nome: 'Haiti 🇭🇹', moeda: 'HTG', taxa: 26.29 },
    { codigo: 'CU', nome: 'Cuba 🇨🇺', moeda: 'CUP', taxa: 4.85 },
    { codigo: 'VE', nome: 'Venezuela 🇻🇪', moeda: 'VES', taxa: 8.5 }
  ];

  // 📞 valida número
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

  // 💱 converter moeda formatado
converter(valor: number): string {
  if (!this.paisAtual) return '0.00';
  return this.formatar(valor * this.paisAtual.taxa);
}

  // 💰 pegar saldo atual
  get saldo(): number {
    return this.auth.usuario()?.saldo ?? 0;
  }

  // 💳 RECARGA COM VALIDAÇÃO
  pagar(valor: number) {

    if (!this.numeroValido) {
      alert('Número inválido');
      return;
    }

    const user = this.auth.usuario();

if (!user) {
  alert('Usuário não autenticado');
  return;
}

// 🔴 VALIDA SALDO
if (user.saldo < valor) {
  alert('❌ Saldo insuficiente');
  return;
}

// ✅ DESCONTA SALDO
this.auth.adicionarSaldoUsuario(user.email, -valor);

// ✅ ENVIA RECARGA
this.recargaService.solicitarRecarga(valor);
alert(`✅ Recarga enviada com sucesso!\nValor: R$ ${this.formatar(valor)}`);
    this.limparFormulario();
  }

  // 🧹 limpar formulário
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