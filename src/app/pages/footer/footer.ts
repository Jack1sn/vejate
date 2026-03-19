import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RedeSocial {
  nome: string;
  url: string;
  iconClass: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {

  scrollTopVisible = false;

  redesSociais: RedeSocial[] = [
    { nome: 'Facebook', url: 'https://www.facebook.com/vejate', iconClass: 'fab fa-facebook-f' },
    { nome: 'Instagram', url: 'https://www.instagram.com/vejate', iconClass: 'fab fa-instagram' },
    { nome: 'Twitter', url: 'https://twitter.com/vejate', iconClass: 'fab fa-twitter' },
    { nome: 'LinkedIn', url: 'https://www.linkedin.com/company/vejate', iconClass: 'fab fa-linkedin-in' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollTopVisible = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}