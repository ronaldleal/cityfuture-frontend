import { Component, OnInit } from '@angular/core';
import { PdfReportService } from '../../services/pdf-report.service';
import { ConstructionService } from '../../services/construction.service';
import { MaterialService } from '../../services/material.service';
import { ConstructionOrder, Material } from '../../models';

@Component({
  selector: 'app-reports-dashboard',
  templateUrl: './reports-dashboard.component.html',
  styleUrls: ['./reports-dashboard.component.css']
})
export class ReportsDashboardComponent implements OnInit {
  
  loading = false;
  constructions: ConstructionOrder[] = [];
  materials: Material[] = [];
  
  // Estadísticas para mostrar en el dashboard
  stats = {
    totalConstructions: 0,
    pendingConstructions: 0,
    inProgressConstructions: 0,
    completedConstructions: 0,
    totalMaterials: 0,
    lowStockMaterials: 0,
    outOfStockMaterials: 0
  };

  constructor(
    private pdfReportService: PdfReportService,
    private constructionService: ConstructionService,
    private materialService: MaterialService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;
    
    // Cargar construcciones
    this.constructionService.getAllOrders().subscribe({
      next: (constructions) => {
        this.constructions = constructions;
        this.calculateConstructionStats();
      },
      error: (error) => {
        console.error('Error loading constructions:', error);
      }
    });

    // Cargar materiales
    this.materialService.getAllMaterials().subscribe({
      next: (materials) => {
        this.materials = materials;
        this.calculateMaterialStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading materials:', error);
        this.loading = false;
      }
    });
  }

  private calculateConstructionStats(): void {
    this.stats.totalConstructions = this.constructions.length;
    this.stats.pendingConstructions = this.constructions.filter(c => c.estado === 'PENDIENTE').length;
    this.stats.inProgressConstructions = this.constructions.filter(c => c.estado === 'EN_PROCESO').length;
    this.stats.completedConstructions = this.constructions.filter(c => c.estado === 'FINALIZADA').length;
  }

  private calculateMaterialStats(): void {
    this.stats.totalMaterials = this.materials.length;
    this.stats.lowStockMaterials = this.materials.filter(m => m.quantity <= 10 && m.quantity > 0).length;
    this.stats.outOfStockMaterials = this.materials.filter(m => m.quantity === 0).length;
  }

  // Métodos para generar reportes PDF
  async generateCompleteReport(): Promise<void> {
    try {
      this.loading = true;
      await this.pdfReportService.generateCompleteReport();
      this.showSuccessMessage('Reporte completo generado exitosamente');
    } catch (error) {
      console.error('Error generating complete report:', error);
      this.showErrorMessage('Error al generar el reporte completo');
    } finally {
      this.loading = false;
    }
  }

  async generateConstructionReport(): Promise<void> {
    try {
      this.loading = true;
      await this.pdfReportService.generateConstructionReport();
      this.showSuccessMessage('Reporte de construcciones generado exitosamente');
    } catch (error) {
      console.error('Error generating construction report:', error);
      this.showErrorMessage('Error al generar el reporte de construcciones');
    } finally {
      this.loading = false;
    }
  }

  async generateMaterialReport(): Promise<void> {
    try {
      this.loading = true;
      await this.pdfReportService.generateMaterialReport();
      this.showSuccessMessage('Reporte de materiales generado exitosamente');
    } catch (error) {
      console.error('Error generating material report:', error);
      this.showErrorMessage('Error al generar el reporte de materiales');
    } finally {
      this.loading = false;
    }
  }

  async generateDashboardReport(): Promise<void> {
    try {
      this.loading = true;
      const fileName = `CityFuture_Dashboard_${new Date().toISOString().split('T')[0]}.pdf`;
      await this.pdfReportService.generateReportFromElement('dashboard-content', fileName);
      this.showSuccessMessage('Reporte del dashboard generado exitosamente');
    } catch (error) {
      console.error('Error generating dashboard report:', error);
      this.showErrorMessage('Error al generar el reporte del dashboard');
    } finally {
      this.loading = false;
    }
  }

  private showSuccessMessage(message: string): void {
    // Podrías implementar un sistema de notificaciones aquí
    alert(`✅ ${message}`);
  }

  private showErrorMessage(message: string): void {
    // Podrías implementar un sistema de notificaciones aquí
    alert(`❌ ${message}`);
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getConstructionTypesSummary(): Array<{name: string, count: number}> {
    const typeCounts: {[key: string]: number} = {};
    
    this.constructions.forEach(construction => {
      const type = construction.typeConstruction || 'Sin definir';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([name, count]) => ({
      name: this.getTypeLabel(name),
      count
    }));
  }

  getCriticalMaterials(): Material[] {
    return this.materials.filter(m => m.quantity <= 10);
  }

  getStockClass(quantity: number): string {
    if (quantity === 0) return 'danger';
    if (quantity <= 5) return 'critical';
    if (quantity <= 10) return 'warning';
    return 'success';
  }

  private getTypeLabel(type: string): string {
    const typeLabels: {[key: string]: string} = {
      'CASA': 'Casa Residencial',
      'EDIFICIO': 'Edificio Comercial',
      'CANCHA_FUTBOL': 'Cancha de Fútbol',
      'LAGO': 'Lago Artificial',
      'GIMNASIO': 'Gimnasio'
    };
    return typeLabels[type] || type;
  }
}
