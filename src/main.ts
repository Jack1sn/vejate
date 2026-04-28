import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [

    // 🌐 HttpClient + Interceptor
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // 🚦 Rotas
    importProvidersFrom(
      RouterModule.forRoot(routes)
    )
  ]
})
.catch(err => console.error('Erro ao iniciar aplicação:', err));