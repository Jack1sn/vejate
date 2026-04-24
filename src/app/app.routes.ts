import { Routes } from '@angular/router';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { CalmanteComponent } from './pages/categoria/calmante/calmante';
import { ClienteComponent } from './pages/cliente/cliente/cliente';
import { AdminComponent } from './pages/admin/admin/admin';
import { DoarComponent } from './pages/doar/doar';
import { DorComponent } from './pages/categoria/dor/dor';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth.guard';

// ✅ NOVO COMPONENTE (histórico)
import { HistoricoRecargasComponent } from './pages/historico-recargas/historico-recargas';

export const routes: Routes = [
  // Página inicial
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Home
  { path: 'home', component: HomeComponent },

  // Login
  { path: 'login', component: LoginComponent },

  { path: 'dor', component: DorComponent },

  // Register
  { path: 'registro', component: RegistroComponent },

  // Categorias
  { path: 'categoria/:tipo', component: CalmanteComponent },

  // Cliente
  { path: 'cliente', component: ClienteComponent },

  // Admin
  { path: 'admin', component: AdminComponent },

  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },

  // 💳 RECARGA / DOAÇÃO
  { path: 'recargar', component: DoarComponent },

  // 📜 HISTÓRICO DE RECARGAS (NOVO)
  { path: 'historico-recargas', component: HistoricoRecargasComponent },

  // fallback
  { path: '**', redirectTo: 'home' }
];