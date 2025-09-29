import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Material } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private apiService: ApiService) { }

  /**
   * Crear un nuevo material
   * Requiere rol ARQUITECTO
   */
  createMaterial(material: Material): Observable<Material> {
    return this.apiService.post<Material>('materials', material);
  }

  /**
   * Obtener todos los materiales
   */
  getAllMaterials(): Observable<Material[]> {
    return this.apiService.get<Material[]>('materials');
  }

  /**
   * Obtener un material específico por ID
   */
  getMaterialById(id: number): Observable<Material> {
    return this.apiService.get<Material>(`materials/${id}`);
  }

  /**
   * Actualizar un material existente
   */
  updateMaterial(id: number, material: Material): Observable<Material> {
    return this.apiService.put<Material>(`materials/${id}`, material);
  }

  /**
   * Eliminar un material
   */
  deleteMaterial(id: number): Observable<any> {
    return this.apiService.delete<any>(`materials/${id}`);
  }

  /**
   * Buscar materiales por nombre
   */
  searchMaterialsByName(name: string): Observable<Material[]> {
    return this.apiService.get<Material[]>(`materials?name=${encodeURIComponent(name)}`);
  }

  /**
   * Verificar stock de un material
   */
  checkStock(materialId: number): Observable<{ available: boolean; quantity: number }> {
    return this.apiService.get<{ available: boolean; quantity: number }>(`materials/${materialId}/stock`);
  }
}