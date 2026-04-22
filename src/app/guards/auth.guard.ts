import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  // 🔐 não logado
  if (!auth.estaLogado()) {
    return router.parseUrl('/login');
  }

  const usuario = auth.usuario(); // ✔ usar signal/computed direto
  const roleEsperada = route.data?.['role'];

  // 🎯 controle de role
  if (roleEsperada && usuario?.role !== roleEsperada) {

    if (usuario?.role === 'admin') {
      return router.parseUrl('/admin/dashboard');
    }

    return router.parseUrl('/home');
  }

  return true;
};