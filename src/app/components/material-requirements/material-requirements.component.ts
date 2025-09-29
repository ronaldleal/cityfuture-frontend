import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ConstructionRequirements, ConstructionRequirementsService } from '../../services/construction-requirements.service';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models';

@Component({
  selector: 'app-material-requirements',
  template: `
    <div class="requirements-container" *ngIf="requirements">
      <div class="requirements-header">
        <h4>📋 Materiales Requeridos para {{ requirements.typeName }}</h4>
        <span class="requirements-summary">
          {{ requirements.totalMaterials }} materiales necesarios
        </span>
      </div>
      
      <div class="requirements-list" *ngIf="requirements.materials.length > 0">
        <div 
          *ngFor="let material of requirements.materials" 
          class="requirement-item"
          [ngClass]="{
            'available': material.isAvailable,
            'insufficient': !material.isAvailable && material.availableStock !== undefined,
            'missing': material.availableStock === 0
          }">
          
          <div class="material-info">
            <span class="material-name">{{ material.materialName }}</span>
            <span class="material-code">({{ material.materialCode }})</span>
          </div>
          
          <div class="quantity-info">
            <span class="required">Requerido: {{ material.requiredQuantity }}</span>
            <span class="available" *ngIf="material.availableStock !== undefined">
              Disponible: {{ material.availableStock }}
            </span>
          </div>
          
          <div class="status-indicator">
            <span *ngIf="material.isAvailable" class="status-ok">✅</span>
            <span *ngIf="!material.isAvailable && material.availableStock !== undefined && material.availableStock > 0" 
                  class="status-warning">⚠️</span>
            <span *ngIf="material.availableStock === 0" class="status-error">❌</span>
            <span *ngIf="material.availableStock === undefined" class="status-unknown">❓</span>
          </div>
        </div>
      </div>
      
      <div class="requirements-status" *ngIf="hasAvailabilityInfo">
        <div class="status-summary">
          <span class="available-count">✅ {{ availableCount }} disponibles</span>
          <span class="insufficient-count" *ngIf="insufficientCount > 0">⚠️ {{ insufficientCount }} insuficientes</span>
          <span class="missing-count" *ngIf="missingCount > 0">❌ {{ missingCount }} faltantes</span>
        </div>
        
        <div class="status-message" [ngClass]="getStatusClass()">
          {{ getStatusMessage() }}
        </div>
      </div>
      
      <div class="loading-message" *ngIf="loading">
        <span>⏳ Verificando disponibilidad de materiales...</span>
      </div>
    </div>
  `,
  styles: [`
    .requirements-container {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
    }
    
    .requirements-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #dee2e6;
    }
    
    .requirements-header h4 {
      margin: 0;
      color: #495057;
      font-size: 1.1em;
    }
    
    .requirements-summary {
      background: #e9ecef;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9em;
      color: #6c757d;
    }
    
    .requirements-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .requirement-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #dee2e6;
      background: white;
    }
    
    .requirement-item.available {
      border-left: 4px solid #28a745;
      background: #f8fff9;
    }
    
    .requirement-item.insufficient {
      border-left: 4px solid #ffc107;
      background: #fffbf0;
    }
    
    .requirement-item.missing {
      border-left: 4px solid #dc3545;
      background: #fff5f5;
    }
    
    .material-info {
      flex: 1;
    }
    
    .material-name {
      font-weight: bold;
      color: #495057;
    }
    
    .material-code {
      color: #6c757d;
      font-size: 0.9em;
      margin-left: 8px;
    }
    
    .quantity-info {
      display: flex;
      flex-direction: column;
      align-items: end;
      margin: 0 16px;
    }
    
    .required {
      font-weight: bold;
      color: #495057;
    }
    
    .available {
      color: #6c757d;
      font-size: 0.9em;
    }
    
    .status-indicator {
      font-size: 1.2em;
    }
    
    .requirements-status {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #dee2e6;
    }
    
    .status-summary {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
      font-size: 0.9em;
    }
    
    .status-message {
      padding: 8px;
      border-radius: 4px;
      font-weight: bold;
      text-align: center;
    }
    
    .status-message.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .status-message.warning {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }
    
    .status-message.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .loading-message {
      text-align: center;
      padding: 20px;
      color: #6c757d;
      font-style: italic;
    }
  `]
})
export class MaterialRequirementsComponent implements OnInit, OnChanges {
  @Input() constructionType: string = '';
  
  requirements: ConstructionRequirements | null = null;
  loading = false;
  hasAvailabilityInfo = false;
  
  // Contadores para el resumen
  availableCount = 0;
  insufficientCount = 0;
  missingCount = 0;

  constructor(
    private requirementsService: ConstructionRequirementsService,
    private materialService: MaterialService
  ) {}

  ngOnInit() {
    this.loadRequirements();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['constructionType'] && !changes['constructionType'].firstChange) {
      this.loadRequirements();
    }
  }

  private loadRequirements() {
    if (!this.constructionType) {
      this.requirements = null;
      return;
    }

    this.loading = true;
    this.requirements = this.requirementsService.getRequirementsForConstruction(this.constructionType);
    
    // Cargar información de disponibilidad
    this.materialService.getAllMaterials().subscribe({
      next: (materials: Material[]) => {
        if (this.requirements) {
          this.requirements = this.requirementsService.updateMaterialAvailability(this.requirements, materials);
          this.updateCounters();
          this.hasAvailabilityInfo = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading material availability:', error);
        this.loading = false;
        this.hasAvailabilityInfo = false;
      }
    });
  }

  private updateCounters() {
    if (!this.requirements) return;

    this.availableCount = this.requirements.materials.filter(m => m.isAvailable).length;
    this.insufficientCount = this.requirements.materials.filter(m => 
      !m.isAvailable && m.availableStock !== undefined && m.availableStock > 0
    ).length;
    this.missingCount = this.requirements.materials.filter(m => m.availableStock === 0).length;
  }

  getStatusMessage(): string {
    if (!this.hasAvailabilityInfo || !this.requirements) {
      return 'Verificando disponibilidad...';
    }

    if (this.availableCount === this.requirements.totalMaterials) {
      return '✅ Todos los materiales están disponibles para la construcción';
    }
    
    if (this.missingCount > 0) {
      return `❌ ${this.missingCount} materiales no están disponibles. No se puede crear la construcción.`;
    }
    
    if (this.insufficientCount > 0) {
      return `⚠️ ${this.insufficientCount} materiales tienen stock insuficiente. No se puede crear la construcción.`;
    }

    return 'Estado desconocido';
  }

  getStatusClass(): string {
    if (!this.hasAvailabilityInfo || !this.requirements) {
      return '';
    }

    if (this.availableCount === this.requirements.totalMaterials) {
      return 'success';
    }
    
    if (this.missingCount > 0) {
      return 'error';
    }
    
    return 'warning';
  }
}