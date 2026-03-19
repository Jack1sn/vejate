import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacidade',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterModule],
  templateUrl: './privacidade.html',
})
export class PrivacidadeComponent {
  dataAtualizacao = '22 de fevereiro de 2026';
}