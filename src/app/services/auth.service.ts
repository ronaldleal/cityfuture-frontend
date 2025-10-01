import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface User {
  username: string;
  authorities: Array<{authority: string}>;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  role: string;
  expiresIn: number;
}

export interface TokenInfo {
  username: string;
  issuer: string;
  issuedAt: Date;
  expiration: Date;
  isExpired: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8084/api';
  private readonly tokenKey = 'jwt_token';
  private readonly userKey = 'current_user';

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    const userData = localStorage.getItem(this.userKey);
    
    if (token && userData && !this.isTokenExpired(token)) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error al cargar usuario del storage:', error);
        this.logout();
      }
    } else {
      // Token expirado o no válido, limpiar storage
      this.logout();
    }
  }

  /**
   * Iniciar sesión con JWT
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials, { headers })
      .pipe(
        map(response => {
          if (response.token) {
            // Guardar token JWT
            this.setToken(response.token);
            
            // Crear objeto usuario a partir de la respuesta
            const user: User = {
              username: response.username,
              authorities: [{ authority: `ROLE_${response.role}` }],
              role: response.role
            };
            
            // Guardar usuario en localStorage y estado
            localStorage.setItem(this.userKey, JSON.stringify(user));
            this.currentUserSubject.next(user);
            
            console.log('Login exitoso:', response);
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
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    console.log('Sesión cerrada');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  /**
   * Obtener el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Obtener el token JWT
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Establecer el token JWT
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Verificar si el token está expirado
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.getTokenPayload(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true;
    }
  }

  /**
   * Obtener el payload del token JWT
   */
  private getTokenPayload(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
      }
      const payload = parts[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error al decodificar token:', error);
      throw error;
    }
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user?.authorities) {
      return false;
    }
    
    // Verificar tanto ROLE_X como X
    const roleToCheck = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
    return user.authorities.some(auth => auth.authority === roleToCheck) ||
           user.role === role;
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
   * Validar token actual con el backend
   */
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/auth/validate`, {}, { headers })
      .pipe(
        map(() => true),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  /**
   * Obtener información del token
   */
  getTokenInfo(): TokenInfo | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = this.getTokenPayload(token);
      return {
        username: payload.sub,
        issuer: payload.iss,
        issuedAt: new Date(payload.iat * 1000),
        expiration: new Date(payload.exp * 1000),
        isExpired: this.isTokenExpired(token)
      };
    } catch (error) {
      console.error('Error al obtener información del token:', error);
      return null;
    }
  }

  /**
   * Obtener usuarios disponibles (para desarrollo/testing)
   */
  getAvailableUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/users`);
  }
}