import { Routes } from '@angular/router';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro'; // <-- import do register
import { CalmanteComponent } from './pages/categoria/calmante/calmante';
import { ClienteComponent } from './pages/cliente/cliente/cliente';
import { AdminComponent } from './pages/admin/admin/admin';
import { DoarComponent } from './pages/doar/doar';

export const routes: Routes = [
  // Página inicial
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Home
  { path: 'home', component: HomeComponent },

  // Login
  { path: 'login', component: LoginComponent },

  // Register
  { path: 'registro', component: RegistroComponent }, // <-- nova rota

  // Categorias (rota dinâmica)
  { path: 'categoria/:tipo', component: CalmanteComponent },

  // Área do cliente
  { path: 'cliente', component: ClienteComponent },

  // Painel admin
  { path: 'admin', component: AdminComponent },

  // Doação
  { path: 'doar', component: DoarComponent },

  // Rota inválida (fallback)
  { path: '**', redirectTo: 'home' }
];