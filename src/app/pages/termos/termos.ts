import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer";

@Component({
  selector: 'app-termos',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './termos.html'
})
export class TermosComponent {
  dataAtualizacao = '22 de fevereiro de 2026';
}