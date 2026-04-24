import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-doar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './doar.html',
  styleUrls: ['./doar.css']
})
export class DoarComponent {

  pixChave = 'jackson@vejate.com';
  pixCopiado = false;

  valorDoacao = 0;
  moeda = 'USD';

  constructor(private http: HttpClient) {}

  copiarPix() {
    navigator.clipboard.writeText(this.pixChave);
    this.pixCopiado = true;
    setTimeout(() => this.pixCopiado = false, 3000);
  }

  doarPayPal() {
    // Usar botão PayPal oficial
    window.open(`https://www.paypal.com/donate?business=jacksmg05@gmail.com&amount=${this.valorDoacao}&currency_code=${this.moeda}`, '_blank');
  }

  async doarStripe() {
    const stripe = await loadStripe('SUA_CHAVE_PUBLICA_STRIPE');

    // chama backend para criar session
    this.http.post<{id: string}>('http://localhost:3000/create-checkout-session', {
      valor: this.valorDoacao,
      moeda: this.moeda
    }).subscribe(async res => {
      if (stripe) {
      //  await stripe.redirectToCheckout({ sessionId: res.id });  
      }
    });
  }

  auth = inject(AuthService);

ehAdmin = this.auth.ehAdmin;
}