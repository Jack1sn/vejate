import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  // 🔐 Se não está logado → vai para login
  if (!auth.estaLogado()) {
    return router.parseUrl('/login');
  }

  const usuario = auth.getUsuario();
  const roleEsperada = route.data?.['role'];

  // 🎯 Se a rota exige role específica
  if (roleEsperada && usuario?.role !== roleEsperada) {

    // Se for admin, manda para admin
    if (usuario?.role === 'admin') {
      return router.parseUrl('/admin');
    }

    // Se for cliente, manda para cliente
    return router.parseUrl('/cliente');
  }

  return true;
};
