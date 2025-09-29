import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Material } from '../models';
import { MaterialService } from './material.service';

export interface StockAlert {
  material: Material;
  currentStock: number;
  level: 'empty' | 'low' | 'critical';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class StockAlertService {
  private stockAlertsSubject = new BehaviorSubject<StockAlert[]>([]);
  public stockAlerts$: Observable<StockAlert[]> = this.stockAlertsSubject.asObservable();

  // Umbrales de stock
  private readonly EMPTY_THRESHOLD = 0;
  private readonly LOW_THRESHOLD = 10;
  private readonly CRITICAL_THRESHOLD = 5;

  constructor(private materialService: MaterialService) {
    this.checkStockLevels();
    // Verificar cada 5 minutos
    setInterval(() => this.checkStockLevels(), 5 * 60 * 1000);
  }

  private checkStockLevels(): void {
    this.materialService.getAllMaterials().subscribe({
      next: (materials) => {
        const alerts: StockAlert[] = [];

        materials.forEach(material => {
          const stock = material.quantity || 0;
          
          if (stock === this.EMPTY_THRESHOLD) {
            alerts.push({
              material,
              currentStock: stock,
              level: 'empty',
              message: `⚠️ ${material.materialName} está agotado`
            });
          } else if (stock <= this.CRITICAL_THRESHOLD) {
            alerts.push({
              material,
              currentStock: stock,
              level: 'critical',
              message: `🔴 ${material.materialName} tiene stock crítico (${stock} unidades)`
            });
          } else if (stock <= this.LOW_THRESHOLD) {
            alerts.push({
              material,
              currentStock: stock,
              level: 'low',
              message: `🟡 ${material.materialName} tiene stock bajo (${stock} unidades)`
            });
          }
        });

        this.stockAlertsSubject.next(alerts);
      },
      error: (error) => {
        console.error('Error checking stock levels:', error);
      }
    });
  }

  public getAlertsCount(): Observable<number> {
    return new Observable(observer => {
      this.stockAlerts$.subscribe(alerts => {
        observer.next(alerts.length);
      });
    });
  }

  public getCriticalAlertsCount(): Observable<number> {
    return new Observable(observer => {
      this.stockAlerts$.subscribe(alerts => {
        const criticalCount = alerts.filter(a => a.level === 'critical' || a.level === 'empty').length;
        observer.next(criticalCount);
      });
    });
  }

  public refreshStockAlerts(): void {
    this.checkStockLevels();
  }
}