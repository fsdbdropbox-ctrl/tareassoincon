export interface MasterLocation {
    id: number;
    name: string;
    code: string;
    description: string | null;
    allowStorage: boolean;
    allowOtherMaterials: boolean;
    allowMaterialRequests: boolean;
    childrenNumber: number;
}

export interface LocationMaterial {
    id?: number;
    locationId: number;
    materialId: number;
    isDefault: boolean;
    unitsToPick: number;
    active?: boolean;
    versionLock?: number;
}