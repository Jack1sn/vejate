import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@Component({
  selector: 'app-credito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credito.html',
})
export class CreditoComponent {

  numero = '';
  numeroValido = false;
  paisDetectado = '';

  paisSelecionado = '';

  valores = [15,20,25,30,35,40,45,50,60,70,80,90,100];

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

      // auto seleciona país
      this.paisSelecionado = this.paisDetectado;
    } else {
      this.numeroValido = false;
      this.paisDetectado = '';
    }
  }

  get paisAtual() {
    return this.paises.find(p => p.codigo === this.paisSelecionado);
  }

  converter(valor: number) {
    if (!this.paisAtual) return 0;
    return (valor * this.paisAtual.taxa).toFixed(2);
  }

  async pagar(valor: number) {
    if (!this.numeroValido) {
      alert('Número inválido');
      return;
    }

    // 🔥 chamada backend
    const resposta = await fetch('http://localhost:3000/pagamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor })
    });

    const data = await resposta.json();

    // redireciona para Stripe
    window.location.href = data.url;
  }

  getBandeira(codigo: string): string {
  if (!codigo) return '';

  return codigo
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}
}