import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StockAlertService, StockAlert } from '../../services/stock-alert.service';

@Component({
  selector: 'app-stock-alerts',
  template: `
    <div class="stock-alerts-container" *ngIf="alerts.length > 0">
      <div class="alert-header">
        <h3>⚠️ Alertas de Stock de Materiales</h3>
        <button class="refresh-btn" (click)="refreshAlerts()" [disabled]="refreshing">
          {{ refreshing ? '⏳' : '🔄' }}
        </button>
      </div>
      
      <div class="alerts-list">
        <div 
          *ngFor="let alert of alerts" 
          class="alert-item"
          [ngClass]="'alert-' + alert.level">
          
          <div class="alert-info">
            <span class="material-name">{{ alert.material.materialName }}</span>
            <span class="material-code">({{ alert.material.code }})</span>
          </div>
          
          <div class="alert-message">{{ alert.message }}</div>
          
          <div class="alert-actions">
            <button 
              class="action-btn view-btn" 
              (click)="viewMaterial(alert.material.id!)"
              title="Ver material">
              👁️
            </button>
          </div>
        </div>
      </div>
      
      <div class="alert-summary">
        Total de alertas: {{ alerts.length }} | 
        Críticas: {{ criticalCount }} | 
        <span class="last-update">Última actualización: {{ lastUpdate | date:'short' }}</span>
      </div>
    </div>
    
    <div class="no-alerts" *ngIf="alerts.length === 0 && !loading">
      <span>✅ No hay alertas de stock</span>
    </div>
  `,
  styles: [`
    .stock-alerts-container {
      background: #fff8e1;
      border: 1px solid #ffb74d;
      border-radius: 8px;
      padding: 12px;
      margin: 12px 0;
      box-shadow: 0 1px 3px rgba(255,152,0,0.2);
    }
    
    .alert-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 8px;
    }
    
    .alert-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.2em;
    }
    
    .refresh-btn {
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 1em;
    }
    
    .refresh-btn:hover:not(:disabled) {
      background: #f5f5f5;
    }
    
    .refresh-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .alerts-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .alert-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      margin: 8px 0;
      border-radius: 6px;
      border-left: 4px solid;
    }
    
    .alert-empty {
      background-color: #ffebee;
      border-left-color: #f44336;
    }
    
    .alert-critical {
      background-color: #fff3e0;
      border-left-color: #ff9800;
    }
    
    .alert-low {
      background-color: #fffde7;
      border-left-color: #ffeb3b;
    }
    
    .alert-info {
      flex: 1;
    }
    
    .material-name {
      font-weight: bold;
      color: #333;
    }
    
    .material-code {
      color: #666;
      font-size: 0.9em;
      margin-left: 8px;
    }
    
    .alert-message {
      flex: 2;
      color: #555;
      margin: 0 16px;
    }
    
    .alert-actions {
      display: flex;
      gap: 8px;
    }
    
    .action-btn {
      padding: 6px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9em;
    }
    
    .view-btn {
      background: #2196f3;
      color: white;
    }
    
    .view-btn:hover {
      background: #1976d2;
    }
    
    .alert-summary {
      margin-top: 16px;
      padding-top: 8px;
      border-top: 1px solid #e0e0e0;
      font-size: 0.9em;
      color: #666;
    }
    
    .last-update {
      font-style: italic;
    }
    
    .no-alerts {
      text-align: center;
      padding: 20px;
      color: #4caf50;
      font-weight: bold;
    }
  `]
})
export class StockAlertsComponent implements OnInit, OnDestroy {
  alerts: StockAlert[] = [];
  criticalCount = 0;
  loading = true;
  refreshing = false;
  lastUpdate = new Date();
  
  private destroy$ = new Subject<void>();

  constructor(private stockAlertService: StockAlertService) {}

  ngOnInit() {
    this.stockAlertService.stockAlerts$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (alerts: StockAlert[]) => {
          this.alerts = alerts;
          this.criticalCount = alerts.filter(a => a.level === 'critical' || a.level === 'empty').length;
          this.loading = false;
          this.refreshing = false;
          this.lastUpdate = new Date();
        },
        error: (error) => {
          console.error('Error loading stock alerts:', error);
          this.loading = false;
          this.refreshing = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshAlerts() {
    this.refreshing = true;
    this.stockAlertService.refreshStockAlerts();
  }

  viewMaterial(materialId: number) {
    // Navegar al detalle del material (esto puede implementarse más adelante)
    console.log('Viewing material:', materialId);
  }
}