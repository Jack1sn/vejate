import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route): boolean | UrlTree => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const usuario = auth.usuario();
  const roleEsperada = route.data?.['role'];

  // 🔐 1. Não autenticado → login
  if (!auth.estaLogado() || !usuario) {
    return router.createUrlTree(['/login']);
  }

  // 🎯 2. Controle de role (admin/client/etc)
  if (roleEsperada && usuario.role !== roleEsperada) {

    // admin sempre vai pro dashboard
    if (usuario.role === 'admin') {
      return router.createUrlTree(['/admin/dashboard']);
    }

    // fallback seguro
    return router.createUrlTree(['/home']);
  }

  return true;
};