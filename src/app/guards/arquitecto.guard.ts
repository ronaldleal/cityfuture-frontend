import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArquitectoGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Observable<boolean> {

    // Verificar autenticación básica
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si tiene rol de arquitecto
    if (!this.authService.isArquitecto()) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // Validar token con el servidor para asegurar que no ha expirado
    return this.authService.validateToken()
      .pipe(
        map(isValid => {
          if (!isValid) {
            this.router.navigate(['/login']);
            return false;
          }
          return true;
        }),
        catchError(() => {
          this.router.navigate(['/login']);
          return [false];
        })
      );
  }
}