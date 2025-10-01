import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Material } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private apiService: ApiService) { }

  createMaterial(material: Material): Observable<Material> {
    return this.apiService.post<Material>('materials', material);
  }

  getAllMaterials(): Observable<Material[]> {
    return this.apiService.get<Material[]>('materials');
  }

  getMaterialById(id: number): Observable<Material> {
    return this.apiService.get<Material>(`materials/${id}`);
  }

  updateMaterial(id: number, material: Material): Observable<Material> {
    return this.apiService.put<Material>(`materials/${id}`, material);
  }

  deleteMaterial(id: number): Observable<any> {
    return this.apiService.delete<any>(`materials/${id}`);
  }

  searchMaterialsByName(name: string): Observable<Material[]> {
    return this.apiService.get<Material[]>(`materials?name=${encodeURIComponent(name)}`);
  }

  checkStock(materialId: number): Observable<{ available: boolean; quantity: number }> {
    return this.apiService.get<{ available: boolean; quantity: number }>(`materials/${materialId}/stock`);
  }
}