export interface Material {
    id?: number;
    clientId?: number;
    measureUnitId: number;
    code: string;
    externalCode?: string;
    name: string;
    description?: string;
    isVirtual: boolean;
    imageUuid?: string;
    compositionImageUuid?: string;
    observations?: string;
    isRawMaterial: boolean;
    isSemifinished: boolean;
    isFinished: boolean;


    versionLock?: number;
    active?: boolean;
    createdAt?: string;
    modifiedAt?: string;
    modifiedBy?: number;
}


export interface MaterialFilter {
    active?: boolean;
    id?: number;
    ids?: number[];
    measureUnitId?: number;
    measureUnitIds?: number[];
    code?: string;
    codes?: string[];
    name?: string;
    custom?: string;
    description?: string;
    isVirtual?: boolean;
    familyIds?: number[];
    isRawMaterial?: boolean;
    isSemifinished?: boolean;
    isFinished?: boolean;
}