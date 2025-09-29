import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from '../../services/material.service';
import { AuthService } from '../../services/auth.service';
import { Material } from '../../models';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css']
})
export class MaterialListComponent implements OnInit {
  materials: Material[] = [];
  loading = false;
  error: string | null = null;
  isArquitecto = false;
  searchTerm = '';
  filteredMaterials: Material[] = [];

  constructor(
    private readonly materialService: MaterialService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.isArquitecto = this.authService.isArquitecto();
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.loading = true;
    this.error = null;

    console.log('Cargando materiales desde:', 'http://localhost:8084/api/materials');

    this.materialService.getAllMaterials().subscribe({
      next: (materials) => {
        console.log('Materiales recibidos:', materials);
        this.materials = materials;
        this.filteredMaterials = materials;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar materiales:', error);
        this.error = error.message || 'Error al cargar los materiales';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredMaterials = this.materials;
      return;
    }

    this.filteredMaterials = this.materials.filter(material =>
      material.materialName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      material.code?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteMaterial(id: number, materialName: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el material "${materialName}"?`)) {
      this.materialService.deleteMaterial(id).subscribe({
        next: () => {
          this.materials = this.materials.filter(m => m.id !== id);
          this.filteredMaterials = this.filteredMaterials.filter(m => m.id !== id);
          console.log(`Material "${materialName}" eliminado exitosamente`);
        },
        error: (error) => {
          this.error = error.message || 'Error al eliminar el material';
          console.error('Error al eliminar material:', error);
        }
      });
    }
  }

  editMaterial(material: Material): void {
    console.log('Navegando a editar material:', material);
    this.router.navigate(['/materials', material.id, 'edit']);
  }

  getStockClass(quantity: number): string {
    if (quantity === 0) return 'stock-empty';
    if (quantity < 10) return 'stock-low';
    if (quantity < 50) return 'stock-medium';
    return 'stock-high';
  }

  getStockLabel(quantity: number): string {
    if (quantity === 0) return 'Agotado';
    if (quantity < 10) return 'Stock Bajo';
    if (quantity < 50) return 'Stock Medio';
    return 'Stock Alto';
  }
}
