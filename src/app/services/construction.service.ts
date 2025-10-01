import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ConstructionOrder, ConstructionOrderResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ConstructionService {

  constructor(private apiService: ApiService) { }

  createOrder(order: ConstructionOrder): Observable<ConstructionOrderResponse> {
    return this.apiService.post<ConstructionOrderResponse>('constructions', order);
  }

  getAllOrders(): Observable<ConstructionOrder[]> {
    return this.apiService.get<ConstructionOrder[]>('constructions');
  }

  getOrderById(id: number): Observable<ConstructionOrder> {
    return this.apiService.get<ConstructionOrder>(`constructions/${id}`);
  }

  updateOrder(id: number, order: ConstructionOrder): Observable<ConstructionOrder> {
    return this.apiService.put<ConstructionOrder>(`constructions/${id}`, order);
  }

  deleteOrder(id: number): Observable<any> {
    return this.apiService.delete<any>(`constructions/${id}`);
  }

  getOrdersByStatus(estado: string): Observable<ConstructionOrder[]> {
    return this.apiService.get<ConstructionOrder[]>(`constructions?estado=${estado}`);
  }
}