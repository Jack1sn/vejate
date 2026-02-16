import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [



    {
        path: '',
        redirectTo:'home',
        pathMatch:'full'
    },
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/admin/admin').then(m => m.AdminComponent)
  },
  {
    path: 'cliente',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cliente/cliente/cliente').then(m => m.ClienteComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(m => m.Register)
  },
   {  path:'**',
    redirectTo: 'home'}
];
