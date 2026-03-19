import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [



    {
        path: '',
        redirectTo:'home',
        pathMatch:'full'
    },
  {
    path: 'home',
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
    path: 'categoria/:categoria',
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

  {
  path: 'categoria/foco',
  loadComponent: () =>
    import('./pages/categoria/foco/foco.component')
      .then(m => m.FocoComponent)
},
{
  path: 'categoria/imunidade',
  loadComponent: () =>
    import('./pages/categoria/imunidade/imunidade')
      .then(m => m.ImunidadeComponent)
},
{
  path: 'categoria/digestao',
  loadComponent: () =>
    import('./pages/categoria/digestao/digestao')
      .then(m => m.DigestaoComponent)
},
{
  path: 'categoria/dor',
  loadComponent: () =>
    import('./pages/categoria/dor/dor')
      .then(m => m.DorComponent)
},
{
  path: 'categoria/calmante',
  loadComponent: () =>
    import('./pages/categoria/calmante/calmante')
      .then(m => m.CalmanteComponent)
},

{
  path: 'registro',
  loadComponent: () =>
    import('./pages/registro/registro')
      .then(m => m.RegistroComponent)
}
,

{
  path: 'doar',
  loadComponent: () =>
    import('./pages/doar/doar')
      .then(m => m.DoarComponent)
},
{
  path: 'privacidade',
  loadComponent: () => import('./pages/privacidade/privacidade')
    .then(m => m.PrivacidadeComponent)
},

{
  path: 'termos',
  loadComponent: () => import('./pages/termos/termos')
    .then(m => m.TermosComponent)
},
   {  path:'**',
    redirectTo: 'home'}
];
