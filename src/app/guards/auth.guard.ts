import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Observable<boolean> {

    // Verificar si está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si se requieren roles específicos
    const requiredRoles = route.data?.['roles'] as string[];
    if (requiredRoles && requiredRoles.length > 0) {
      if (!this.authService.hasAnyRole(requiredRoles)) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    // Validar token con el servidor
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