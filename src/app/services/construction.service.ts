import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ConstructionOrder, ConstructionOrderResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ConstructionService {

  constructor(private apiService: ApiService) { }

  /**
   * Crear una nueva orden de construcción
   * Requiere rol ARQUITECTO
   */
  createOrder(order: ConstructionOrder): Observable<ConstructionOrderResponse> {
    return this.apiService.post<ConstructionOrderResponse>('constructions', order);
  }

  /**
   * Obtener todas las órdenes de construcción
   */
  getAllOrders(): Observable<ConstructionOrder[]> {
    return this.apiService.get<ConstructionOrder[]>('constructions');
  }

  /**
   * Obtener una orden específica por ID
   */
  getOrderById(id: number): Observable<ConstructionOrder> {
    return this.apiService.get<ConstructionOrder>(`constructions/${id}`);
  }

  /**
   * Actualizar una orden de construcción
   */
  updateOrder(id: number, order: ConstructionOrder): Observable<ConstructionOrder> {
    return this.apiService.put<ConstructionOrder>(`constructions/${id}`, order);
  }

  /**
   * Eliminar una orden de construcción
   */
  deleteOrder(id: number): Observable<any> {
    return this.apiService.delete<any>(`constructions/${id}`);
  }

  /**
   * Obtener órdenes por estado
   */
  getOrdersByStatus(estado: string): Observable<ConstructionOrder[]> {
    return this.apiService.get<ConstructionOrder[]>(`constructions?estado=${estado}`);
  }
}