import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  // 🔑 pega token
  const token = localStorage.getItem('token');

  // 🔐 adiciona Authorization automaticamente
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(

    // 🚨 tratamento global de erro
    catchError((error: HttpErrorResponse) => {

      // 🔥 se token inválido/expirado
      if (error.status === 401) {

        console.warn('Sessão expirada. Fazendo logout...');

        // limpa dados
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // redireciona login
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};