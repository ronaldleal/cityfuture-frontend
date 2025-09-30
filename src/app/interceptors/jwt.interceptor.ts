import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Lista de URLs que no requieren token JWT
    const skipUrls = [
      '/api/auth/login',
      '/api/auth/register'
    ];

    // Verificar si la URL debe omitir el token
    const shouldSkip = skipUrls.some(url => request.url.includes(url));

    if (!shouldSkip) {
      // Obtener el token del AuthService
      const token = this.authService.getToken();
      
      if (token) {
        // Clonar la request y agregar el header Authorization
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    // Continuar con la request y manejar errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expirado o inválido - redirigir al login
          console.warn('Token JWT inválido o expirado. Redirigiendo al login...');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Sin permisos - redirigir a página de no autorizado
          console.warn('Acceso denegado. Permisos insuficientes.');
          this.router.navigate(['/unauthorized']);
        }
        
        return throwError(() => error);
      })
    );
  }
}