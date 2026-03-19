import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule,FooterComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {

  // Regras de negócio para o cliente
  avisoCliente = `
    ⚠️ Esta página é apenas informativa.
    As receitas disponibilizadas no VEJATE não substituem orientação médica.
  `;

  // Podem ser adicionados métodos para destaque ou redirecionamento
  irParaCliente() {
    // Aqui poderia ter lógica de tracking ou confirmação antes de ir para receitas
  }
}
