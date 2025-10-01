import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConstructionService } from '../../services/construction.service';
import { ConstructionOrder } from '../../models';

@Component({
  selector: 'app-construction-form',
  templateUrl: './construction-form.component.html',
  styleUrls: ['./construction-form.component.css']
})
export class ConstructionFormComponent implements OnInit {
  constructionForm: FormGroup;
  isEditing = false;
  constructionId?: number;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructionTypes = [
    'CASA',
    'LAGO',
    'CANCHA_FUTBOL',
    'EDIFICIO',
    'GIMNASIO'
  ];

  constructor(
    private fb: FormBuilder,
    private constructionService: ConstructionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.constructionForm = this.createForm();
  }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.constructionId = +id;
      this.loadConstruction(this.constructionId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      typeConstruction: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]]
    });
  }

  loadConstruction(id: number): void {
    this.loading = true;
    this.constructionService.getOrderById(id).subscribe({
      next: (construction) => {
        this.constructionForm.patchValue({
          projectName: construction.projectName,
          typeConstruction: construction.typeConstruction,
          latitude: construction.location.latitude,
          longitude: construction.location.longitude
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = this.extractErrorMessage(error);
        this.loading = false;
        console.error('Error al cargar:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.constructionForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = null;

      const formValue = this.constructionForm.value;
      const construction: ConstructionOrder = {
        projectName: formValue.projectName,
        typeConstruction: formValue.typeConstruction,
        location: {
          latitude: parseFloat(formValue.latitude),
          longitude: parseFloat(formValue.longitude)
        }
      };

      if (this.isEditing && this.constructionId) {
        // Actualizar construcción existente
        this.constructionService.updateOrder(this.constructionId, construction).subscribe({
          next: (updatedConstruction) => {
            this.success = 'Construcción actualizada exitosamente';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/constructions']);
            }, 2000);
          },
          error: (error) => {
            this.error = this.extractErrorMessage(error);
            this.loading = false;
            console.error('Error al actualizar:', error);
          }
        });
      } else {
        // Crear nueva construcción
        this.constructionService.createOrder(construction).subscribe({
          next: (newConstruction) => {
            this.success = 'Construcción creada exitosamente';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/constructions']);
            }, 2000);
          },
          error: (error) => {
            this.error = this.extractErrorMessage(error);
            this.loading = false;
            console.error('Error al crear:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.constructionForm.controls).forEach(key => {
      const control = this.constructionForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/constructions']);
  }

  private extractErrorMessage(error: any): string {
    // Extraer el mensaje desde diferentes posibles ubicaciones
    let errorMessage = '';
    
    if (error.originalError?.error?.message) {
      errorMessage = error.originalError.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.originalError?.error) {
      errorMessage = error.originalError.error;
    }
    
    // Manejar errores específicos con mensajes mejorados
    if (errorMessage.includes('Tipo de construcción no válido')) {
      return `❌ Tipo de construcción no válido. Los tipos disponibles son: ${this.constructionTypes.map(t => this.getTypeLabel(t)).join(', ')}`;
    }
    
    if (errorMessage.includes('Material insuficiente')) {
      return `📦 ${errorMessage}. Por favor, verifica el stock de materiales antes de crear la construcción.`;
    }
    
    if (errorMessage.includes('Ubicación ocupada') || errorMessage.includes('coordenadas ya están ocupadas')) {
      return `📍 La ubicación especificada ya está ocupada por otra construcción. Por favor, elige coordenadas diferentes.`;
    }
    
    if (errorMessage.includes('Material no encontrado')) {
      return `❌ ${errorMessage}. Algunos materiales requeridos no están registrados en el sistema.`;
    }
    
    // Si tenemos el mensaje original, devolverlo
    if (errorMessage) {
      return errorMessage;
    }
    
    // Fallback genérico
    return 'Error al procesar la solicitud. Por favor, verifica los datos e intenta nuevamente.';
  }

  // Método para obtener etiquetas amigables para los tipos
  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'CASA': 'Casa',
      'LAGO': 'Lago',
      'CANCHA_FUTBOL': 'Cancha de Fútbol',
      'EDIFICIO': 'Edificio',
      'GIMNASIO': 'Gimnasio'
    };
    return labels[type] || type;
  }

  // Getters para facilitar el acceso a los controles del formulario
  get projectName() { return this.constructionForm.get('projectName'); }
  get typeConstruction() { return this.constructionForm.get('typeConstruction'); }
  get latitude() { return this.constructionForm.get('latitude'); }
  get longitude() { return this.constructionForm.get('longitude'); }
}
