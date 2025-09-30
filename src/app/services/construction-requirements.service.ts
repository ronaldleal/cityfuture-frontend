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

  // Mapa de requerimientos de materiales por tipo de construcción (sincronizado con backend)
  private readonly materialRequirements: { [key: string]: { [materialCode: string]: number } } = {
    'CASA': {
      'Ce': 100,
      'Gr': 50,
      'Ar': 90,
      'Ma': 20,
      'Ad': 100
    },
    'EDIFICIO': {
      'Ce': 200,
      'Gr': 100,
      'Ar': 180,
      'Ma': 40,
      'Ad': 200
    },
    'CANCHA_FUTBOL': {
      'Ce': 20,
      'Gr': 20,
      'Ar': 20,
      'Ma': 20,
      'Ad': 20
    },
    'LAGO': {
      'Ce': 50,
      'Gr': 60,
      'Ar': 80,
      'Ma': 10,
      'Ad': 20
    },
    'GIMNASIO': {
      'Ce': 50,
      'Gr': 25,
      'Ar': 45,
      'Ma': 10,
      'Ad': 50
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
      'Ce': 'Cemento',
      'Gr': 'Grava',
      'Ar': 'Arena',
      'Ma': 'Madera',
      'Ad': 'Adobe'
    };
    return nameMap[materialCode] || materialCode;
  }
}