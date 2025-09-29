import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models';

@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.css']
})
export class MaterialFormComponent implements OnInit {
  materialForm: FormGroup;
  isEditing = false;
  materialId?: number;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly materialService: MaterialService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.materialForm = this.createForm();
  }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.materialId = +id;
      this.loadMaterial(this.materialId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      materialName: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadMaterial(id: number): void {
    this.loading = true;
    this.materialService.getMaterialById(id).subscribe({
      next: (material) => {
        this.materialForm.patchValue({
          materialName: material.materialName,
          code: material.code,
          quantity: material.quantity
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = this.extractErrorMessage(error);
        this.loading = false;
        console.error('Error al cargar material:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.materialForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = null;

      const formValue = this.materialForm.value;
      const material: Material = {
        materialName: formValue.materialName,
        code: formValue.code,
        quantity: parseInt(formValue.quantity, 10)
      };

      if (this.isEditing && this.materialId) {
        // Actualizar material existente
        this.materialService.updateMaterial(this.materialId, material).subscribe({
          next: (updatedMaterial) => {
            this.success = 'Material actualizado exitosamente';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/materials']);
            }, 2000);
          },
          error: (error) => {
            this.error = this.extractErrorMessage(error);
            this.loading = false;
            console.error('Error al actualizar:', error);
          }
        });
      } else {
        // Crear nuevo material
        this.materialService.createMaterial(material).subscribe({
          next: (newMaterial) => {
            this.success = 'Material creado exitosamente';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/materials']);
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
    Object.keys(this.materialForm.controls).forEach(key => {
      const control = this.materialForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/materials']);
  }

  private extractErrorMessage(error: any): string {
    // Extraer mensaje específico del backend
    if (error.originalError?.error?.message) {
      return error.originalError.error.message;
    }
    
    // Si viene del ApiService
    if (error.message) {
      return error.message;
    }
    
    // Fallback genérico
    return 'Error al procesar la solicitud. Por favor, verifica los datos e intenta nuevamente.';
  }

  // Getters para facilitar el acceso a los controles del formulario
  get materialName() { return this.materialForm.get('materialName'); }
  get code() { return this.materialForm.get('code'); }
  get quantity() { return this.materialForm.get('quantity'); }
}