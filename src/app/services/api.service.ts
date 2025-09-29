import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHttpOptions(): { headers: HttpHeaders } {
    // Por ahora usamos credenciales del arquitecto para pruebas (tiene más permisos)
    const username = 'arquitecto';
    const password = '1234';
    const basicAuthCredentials = btoa(`${username}:${password}`);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${basicAuthCredentials}`
    });
    return { headers };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Solicitud incorrecta';
          break;
        case 401:
          errorMessage = 'No autorizado. Credenciales incorrectas';
          // Opcional: redirigir al login
          localStorage.removeItem('basicAuth');
          break;
        case 403:
          errorMessage = 'Acceso prohibido. No tienes permisos suficientes';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 500:
          errorMessage = error.error?.message || 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
      }
    }

    console.error('Error en API:', error);
    return throwError(() => ({ message: errorMessage, originalError: error }));
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, this.getHttpOptions())
      .pipe(
        retry(1),
        catchError(this.handleError.bind(this))
      );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, this.getHttpOptions())
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, this.getHttpOptions())
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, this.getHttpOptions())
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Método para establecer credenciales de autenticación
  setAuthCredentials(username: string, password: string): void {
    const credentials = btoa(`${username}:${password}`);
    localStorage.setItem('basicAuth', credentials);
  }

  // Método para remover las credenciales de autenticación
  removeAuthCredentials(): void {
    localStorage.removeItem('basicAuth');
  }

  // Método para verificar si hay credenciales válidas
  hasAuthCredentials(): boolean {
    return !!localStorage.getItem('basicAuth');
  }

  // Método para obtener las credenciales almacenadas (para uso futuro)
  private getStoredCredentials(): string | null {
    return localStorage.getItem('basicAuth');
  }
}