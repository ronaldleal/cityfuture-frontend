import { Injectable } from '@angular/core';

export interface MaterialRequirement {
  materialCode: string;
  materialName: string;
  requiredQuantity: number;
  availableStock?: number;
  isAvailable?: boolean;
}

export interface ConstructionRequirements {
  constructionType: string;
  typeName: string;
  materials: MaterialRequirement[];
  totalMaterials: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConstructionRequirementsService {

  // Mapa de requerimientos de materiales por tipo de construcción
  private readonly materialRequirements: { [key: string]: { [materialCode: string]: number } } = {
    'CASA': {
      'CEMENTO': 50,
      'LADRILLO': 100,
      'ACERO': 20,
      'ARENA': 30
    },
    'EDIFICIO': {
      'CEMENTO': 200,
      'LADRILLO': 500,
      'ACERO': 100,
      'ARENA': 150,
      'VIDRIO': 50
    },
    'CANCHA_FUTBOL': {
      'CESPED': 1000,
      'ARENA': 200,
      'CEMENTO': 100,
      'ACERO': 50
    },
    'LAGO': {
      'CEMENTO': 80,
      'ARENA': 100,
      'ACERO': 30,
      'PIEDRA': 200
    },
    'GIMNASIO': {
      'CEMENTO': 120,
      'LADRILLO': 300,
      'ACERO': 80,
      'ARENA': 100,
      'VIDRIO': 30
    }
  };

  private readonly constructionTypeNames: { [key: string]: string } = {
    'CASA': 'Casa Residencial',
    'EDIFICIO': 'Edificio Comercial',
    'CANCHA_FUTBOL': 'Cancha de Fútbol',
    'LAGO': 'Lago Artificial',
    'GIMNASIO': 'Gimnasio'
  };

  constructor() {}

  getRequirementsForConstruction(constructionType: string): ConstructionRequirements {
    const materials = this.materialRequirements[constructionType] || {};
    const materialList: MaterialRequirement[] = [];

    for (const [materialCode, requiredQuantity] of Object.entries(materials)) {
      materialList.push({
        materialCode,
        materialName: this.getMaterialName(materialCode),
        requiredQuantity
      });
    }

    return {
      constructionType,
      typeName: this.constructionTypeNames[constructionType] || constructionType,
      materials: materialList,
      totalMaterials: materialList.length
    };
  }

  getAllConstructionTypes(): string[] {
    return Object.keys(this.materialRequirements);
  }

  getConstructionTypeName(type: string): string {
    return this.constructionTypeNames[type] || type;
  }

  updateMaterialAvailability(requirements: ConstructionRequirements, availableMaterials: any[]): ConstructionRequirements {
    const materialsMap = new Map(availableMaterials.map(m => [m.code, m]));

    requirements.materials.forEach(req => {
      const availableMaterial = materialsMap.get(req.materialCode);
      if (availableMaterial) {
        req.availableStock = availableMaterial.quantity;
        req.isAvailable = availableMaterial.quantity >= req.requiredQuantity;
        req.materialName = availableMaterial.materialName;
      } else {
        req.availableStock = 0;
        req.isAvailable = false;
      }
    });

    return requirements;
  }

  private getMaterialName(materialCode: string): string {
    const nameMap: { [key: string]: string } = {
      'CEMENTO': 'Cemento',
      'LADRILLO': 'Ladrillo',
      'ACERO': 'Acero',
      'ARENA': 'Arena',
      'VIDRIO': 'Vidrio',
      'CESPED': 'Césped',
      'PIEDRA': 'Piedra'
    };
    return nameMap[materialCode] || materialCode;
  }
}