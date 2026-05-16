import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const isLoginRequest = req.url.includes('/auth/login') || req.url.includes('/usuarios/registrar');

  const token = localStorage.getItem('token');

  console.log('📌 INTERCEPTOR URL:', req.url);
  console.log('📌 TOKEN:', token);

  // 🔥 SEMPRE clonar de forma segura
  let authReq = req;

  if (token && !isLoginRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      console.log('❌ HTTP ERROR:', error.status, error.url);

      // 🚫 não interceptar login
      if (isLoginRequest) {
        return throwError(() => error);
      }

      // 🔐 token inválido ou expirado
      if (error.status === 401 || error.status === 403) {

        console.warn('🔒 Token inválido ou sem permissão');

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (router.url !== '/login') {
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    })
  );
};