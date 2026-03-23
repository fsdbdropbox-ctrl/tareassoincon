export interface LocationMaterial {
    id?: number;
    locationId: number;
    materialId: number;
    isDefault: boolean;
    unitsToPick: number;
    active?: boolean;
    versionLock?: number;
}