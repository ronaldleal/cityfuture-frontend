import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Intentar recuperar usuario del localStorage al inicializar
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData && this.apiService.hasAuthCredentials()) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error al cargar usuario del storage:', error);
        this.logout();
      }
    }
  }

  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('auth/login', credentials)
      .pipe(
        map(response => {
          if (response.token && response.user) {
            // Guardar credenciales básicas y usuario
            this.apiService.setAuthCredentials('usuario', '1234');
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
          return response;
        }),
        catchError(error => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.apiService.removeAuthCredentials();
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Registrar nuevo usuario
   */
  register(userData: any): Observable<any> {
    return this.apiService.post('auth/register', userData);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    // Temporalmente devuelve true para pruebas
    return true;
    // return this.currentUserSubject.value !== null && this.apiService.hasAuthToken();
  }

  /**
   * Obtener el usuario actual
   */
  getCurrentUser(): User | null {
    // Temporalmente devuelve un usuario mock para pruebas
    return {
      id: 1,
      username: 'test_user',
      email: 'test@test.com',
      roles: ['ARQUITECTO']
    };
    // return this.currentUserSubject.value;
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    // Temporalmente devuelve true para ARQUITECTO
    return role === 'ARQUITECTO';
    // const user = this.getCurrentUser();
    // return user?.roles?.includes(role) || false;
  }

  /**
   * Verificar si el usuario es ARQUITECTO
   */
  isArquitecto(): boolean {
    return this.hasRole('ARQUITECTO');
  }

  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Refrescar token (si el backend lo soporta)
   */
  refreshToken(): Observable<any> {
    return this.apiService.post('auth/refresh', {})
      .pipe(
        map((response: any) => {
          if (response.token) {
            this.apiService.setAuthCredentials('usuario', '1234');
          }
          return response;
        }),
        catchError(error => {
          console.error('Error al refrescar token:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Validar token actual
   */
  validateToken(): Observable<boolean> {
    if (!this.apiService.hasAuthCredentials()) {
      return of(false);
    }

    return this.apiService.get<any>('auth/validate')
      .pipe(
        map(() => true),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }
}