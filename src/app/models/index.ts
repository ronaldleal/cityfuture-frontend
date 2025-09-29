// ==========================================
// MODELOS PARA CITYFUTURE API
// ==========================================

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface ConstructionOrder {
  id?: number;
  projectName: string;
  location: Coordinate;
  typeConstruction: string;
  estado?: string;
  estimatedDays?: number;
  entregaDate?: string; // ISO date string
}

export interface Material {
  id?: number;
  materialName: string;
  code: string;
  quantity: number;
}

export interface ProjectSummary {
  totalConstructionDays: number;
  projectStartDate: string; // ISO date string
  projectEndDate: string; // ISO date string
  estimatedDeliveryDate: string; // ISO date string
  totalOrders: number;
  status: string;
}

export interface ConstructionReport {
  reportDate: string; // ISO date string
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  finishedOrders: number;
  pendingByType: { [key: string]: number };
  inProgressByType: { [key: string]: number };
  finishedByType: { [key: string]: number };
  projectSummary: ProjectSummary;
}

// DTOs para requests
export interface ConstructionRequestDto {
  constructionType: string;
  x: number;
  y: number;
  requestDate: string; // ISO date string
}

export interface MaterialDto {
  materialType: string;
  quantity: number;
}

// Respuestas de la API
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface ConstructionOrderResponse {
  idOrden: number;
  message: string;
  estado: string;
}

// Tipos de construcción disponibles
export type ConstructionType = 'Casa' | 'Lago' | 'Parque' | 'Oficina';

// Estados de las órdenes de construcción
export type OrderStatus = 'PENDIENTE' | 'EN_PROGRESO' | 'FINALIZADA' | 'CANCELADA';