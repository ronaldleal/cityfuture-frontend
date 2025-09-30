import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  availableUsers: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.createForm();
    this.loadAvailableUsers();
  }

  private createForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  private loadAvailableUsers(): void {
    this.authService.getAvailableUsers().subscribe({
      next: (users) => {
        this.availableUsers = users;
        console.log('Usuarios disponibles:', users);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        // Redirigir al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessage = error.error?.message || 'Error de autenticación';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos de conveniencia para el template
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  selectUser(username: string, password: string): void {
    this.loginForm.patchValue({
      username: username,
      password: password
    });
  }

  getPasswordFromDescription(description: string): string {
    // Extraer la contraseña de la descripción
    const match = description.match(/Password: (.+)/);
    return match ? match[1] : '';
  }

  // Exponer Object.keys para el template
  get Object() { return Object; }
}
