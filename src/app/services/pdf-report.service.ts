import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ConstructionService } from './construction.service';
import { MaterialService } from './material.service';
import { ConstructionOrder, Material } from '../models';

export interface ReportData {
  constructions: ConstructionOrder[];
  materials: Material[];
  reportDate: Date;
  totalConstructions: number;
  totalMaterials: number;
  lowStockMaterials: Material[];
}

@Injectable({
  providedIn: 'root'
})
export class PdfReportService {

  constructor(
    private constructionService: ConstructionService,
    private materialService: MaterialService
  ) {}

  // Generar reporte completo del sistema
  async generateCompleteReport(): Promise<void> {
    try {
      const reportData = await this.gatherReportData();
      const pdf = new jsPDF();
      
      await this.buildCompleteReport(pdf, reportData);
      
      const fileName = `CityFuture_Reporte_Completo_${this.formatDate(new Date())}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating complete report:', error);
      throw error;
    }
  }

  // Generar reporte solo de construcciones
  async generateConstructionReport(): Promise<void> {
    try {
      const constructions = await this.constructionService.getAllOrders().toPromise();
      const pdf = new jsPDF();
      
      await this.buildConstructionReport(pdf, constructions || []);
      
      const fileName = `CityFuture_Reporte_Construcciones_${this.formatDate(new Date())}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating construction report:', error);
      throw error;
    }
  }

  // Generar reporte solo de materiales
  async generateMaterialReport(): Promise<void> {
    try {
      const materials = await this.materialService.getAllMaterials().toPromise();
      const pdf = new jsPDF();
      
      await this.buildMaterialReport(pdf, materials || []);
      
      const fileName = `CityFuture_Reporte_Materiales_${this.formatDate(new Date())}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating material report:', error);
      throw error;
    }
  }

  // Generar reporte desde elemento HTML
  async generateReportFromElement(elementId: string, fileName: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      // Agregar header
      this.addReportHeader(pdf);
      position = 40;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - position;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating report from element:', error);
      throw error;
    }
  }

  private async gatherReportData(): Promise<ReportData> {
    const [constructions, materials] = await Promise.all([
      this.constructionService.getAllOrders().toPromise(),
      this.materialService.getAllMaterials().toPromise()
    ]);

    const lowStockMaterials = (materials || []).filter(m => m.quantity <= 10);

    return {
      constructions: constructions || [],
      materials: materials || [],
      reportDate: new Date(),
      totalConstructions: (constructions || []).length,
      totalMaterials: (materials || []).length,
      lowStockMaterials
    };
  }

  private async buildCompleteReport(pdf: jsPDF, data: ReportData): Promise<void> {
    // Header del reporte
    this.addReportHeader(pdf);

    // Resumen ejecutivo
    let yPosition = 50;
    pdf.setFontSize(16);
    pdf.text('📊 RESUMEN EJECUTIVO', 20, yPosition);
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.text(`• Total de Construcciones: ${data.totalConstructions}`, 25, yPosition);
    yPosition += 10;
    pdf.text(`• Total de Materiales: ${data.totalMaterials}`, 25, yPosition);
    yPosition += 10;
    pdf.text(`• Materiales con stock bajo: ${data.lowStockMaterials.length}`, 25, yPosition);
    yPosition += 10;
    pdf.text(`• Fecha del reporte: ${this.formatDate(data.reportDate)}`, 25, yPosition);

    // Construcciones por estado
    yPosition += 20;
    pdf.setFontSize(16);
    pdf.text('🏗️ CONSTRUCCIONES POR ESTADO', 20, yPosition);
    
    yPosition += 15;
    const pendientes = data.constructions.filter(c => c.estado === 'PENDIENTE').length;
    const enProceso = data.constructions.filter(c => c.estado === 'EN_PROCESO').length;
    const finalizadas = data.constructions.filter(c => c.estado === 'FINALIZADA').length;

    pdf.setFontSize(12);
    pdf.text(`• Pendientes: ${pendientes}`, 25, yPosition);
    yPosition += 10;
    pdf.text(`• En Proceso: ${enProceso}`, 25, yPosition);
    yPosition += 10;
    pdf.text(`• Finalizadas: ${finalizadas}`, 25, yPosition);

    // Nueva página para materiales
    pdf.addPage();
    this.addReportHeader(pdf);
    
    yPosition = 50;
    pdf.setFontSize(16);
    pdf.text('📦 ESTADO DE MATERIALES', 20, yPosition);

    if (data.lowStockMaterials.length > 0) {
      yPosition += 20;
      pdf.setFontSize(14);
      pdf.text('⚠️ Materiales con Stock Bajo:', 25, yPosition);
      
      data.lowStockMaterials.forEach(material => {
        yPosition += 15;
        if (yPosition > 250) {
          pdf.addPage();
          this.addReportHeader(pdf);
          yPosition = 50;
        }
        pdf.setFontSize(11);
        pdf.text(`• ${material.materialName} (${material.code}): ${material.quantity} unidades`, 30, yPosition);
      });
    }
  }

  private async buildConstructionReport(pdf: jsPDF, constructions: ConstructionOrder[]): Promise<void> {
    this.addReportHeader(pdf);

    let yPosition = 50;
    pdf.setFontSize(18);
    pdf.text('🏗️ REPORTE DE CONSTRUCCIONES', 20, yPosition);

    yPosition += 20;
    pdf.setFontSize(12);
    pdf.text(`Total de construcciones: ${constructions.length}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Fecha del reporte: ${this.formatDate(new Date())}`, 20, yPosition);

    yPosition += 20;
    constructions.forEach((construction, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        this.addReportHeader(pdf);
        yPosition = 50;
      }

      pdf.setFontSize(12);
      pdf.text(`${index + 1}. ${construction.projectName}`, 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.text(`   Tipo: ${construction.typeConstruction}`, 25, yPosition);
      yPosition += 8;
      pdf.text(`   Estado: ${construction.estado || 'No definido'}`, 25, yPosition);
      yPosition += 8;
      pdf.text(`   Ubicación: ${construction.location.latitude}, ${construction.location.longitude}`, 25, yPosition);
      yPosition += 15;
    });
  }

  private async buildMaterialReport(pdf: jsPDF, materials: Material[]): Promise<void> {
    this.addReportHeader(pdf);

    let yPosition = 50;
    pdf.setFontSize(18);
    pdf.text('📦 REPORTE DE MATERIALES', 20, yPosition);

    yPosition += 20;
    pdf.setFontSize(12);
    pdf.text(`Total de materiales: ${materials.length}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Fecha del reporte: ${this.formatDate(new Date())}`, 20, yPosition);

    yPosition += 20;
    materials.forEach((material, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        this.addReportHeader(pdf);
        yPosition = 50;
      }

      const stockStatus = this.getStockStatus(material.quantity);
      pdf.setFontSize(12);
      pdf.text(`${index + 1}. ${material.materialName}`, 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.text(`   Código: ${material.code}`, 25, yPosition);
      yPosition += 8;
      pdf.text(`   Stock: ${material.quantity} unidades - ${stockStatus}`, 25, yPosition);
      yPosition += 15;
    });
  }

  private addReportHeader(pdf: jsPDF): void {
    // Logo/Título
    pdf.setFontSize(24);
    pdf.text('🏗️ CityFuture', 20, 20);
    
    // Subtítulo
    pdf.setFontSize(12);
    pdf.text('Sistema de Gestión de Construcciones', 20, 30);
    
    // Línea separadora
    pdf.line(20, 35, 190, 35);
  }

  private getStockStatus(quantity: number): string {
    if (quantity === 0) return 'AGOTADO';
    if (quantity <= 5) return 'CRÍTICO';
    if (quantity <= 10) return 'BAJO';
    return 'NORMAL';
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}