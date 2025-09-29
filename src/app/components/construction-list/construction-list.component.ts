import { Component, OnInit } from '@angular/core';
import { ConstructionService } from '../../services/construction.service';
import { AuthService } from '../../services/auth.service';
import { ConstructionOrder } from '../../models';

@Component({
  selector: 'app-construction-list',
  templateUrl: './construction-list.component.html',
  styleUrls: ['./construction-list.component.css']
})
export class ConstructionListComponent implements OnInit {
  constructions: ConstructionOrder[] = [];
  loading = false;
  error: string | null = null;
  isArquitecto = false;

  constructor(
    private constructionService: ConstructionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isArquitecto = this.authService.isArquitecto();
    this.loadConstructions();
  }

  loadConstructions(): void {
    this.loading = true;
    this.error = null;

    console.log('Intentando cargar construcciones desde:', 'http://localhost:8084/api/constructions');

    this.constructionService.getAllOrders().subscribe({
      next: (constructions) => {
        console.log('Construcciones recibidas:', constructions);
        
        // Debug: mostrar todos los estados únicos que existen
        const estadosUnicos = [...new Set(constructions.map(c => c.estado))];
        console.log('Estados únicos encontrados en la BD:', estadosUnicos);
        
        // Debug: mostrar cada construcción con su estado exacto
        constructions.forEach((c, index) => {
          console.log(`Construcción ${index + 1}: "${c.projectName}" - Estado: "${c.estado}" (longitud: ${c.estado?.length})`);
        });
        
        this.constructions = constructions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error completo:', error);
        console.error('Status:', error.originalError?.status);
        console.error('Error message:', error.originalError?.error);
        
        this.error = error.message || 'Error al cargar las construcciones';
        this.loading = false;
      }
    });
  }

  filterByStatus(status: string): void {
    console.log('Filtrando por estado:', status);
    this.loading = true;
    this.error = null;

    if (status === 'all') {
      console.log('Cargando todas las construcciones');
      this.loadConstructions();
      return;
    }

    console.log('Llamando al servicio para filtrar por estado:', status);
    this.constructionService.getOrdersByStatus(status).subscribe({
      next: (constructions) => {
        console.log(`Construcciones filtradas por estado "${status}":`, constructions);
        this.constructions = constructions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al filtrar por estado:', error);
        this.error = error.message || 'Error al filtrar construcciones';
        this.loading = false;
      }
    });
  }

  deleteConstruction(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta construcción?')) {
      this.constructionService.deleteOrder(id).subscribe({
        next: () => {
          this.constructions = this.constructions.filter(c => c.id !== id);
        },
        error: (error) => {
          this.error = error.message || 'Error al eliminar la construcción';
          console.error('Error:', error);
        }
      });
    }
  }

  getStatusClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE': return 'status-pending';
      case 'EN_PROGRESO': 
      case 'EN PROGRESO': return 'status-progress';
      case 'FINALIZADO': 
      case 'FINALIZADA': return 'status-completed';
      case 'CANCELADO':
      case 'CANCELADA': return 'status-cancelled';
      default: return 'status-unknown';
    }
  }
}
