// esta interfaz representa la estructura de datos de una fábrica,
// que se espera recibir del backend
// ejemplo de datos recibidos: 
// [
//     {
//         "versionLock": 1,
//         "active": true,
//         "createdAt": "2026-03-17T07:28:41.605785Z",
//         "modifiedAt": "2026-03-17T07:28:41.605785Z",
//         "modifiedBy": null,
//         "id": 39,
//         "clientId": 1,
//         "code": "rtwth",
//         "externalCode": "yjyt",
//         "name": "yjy",
//         "description": "yjty",
//         "imageUuid": null,
//         "treePosition": null,
//         "status": "ENABLED",
//         "supervisor": null,
//         "area": null
//     }, 
// {}, 
// ...]
// en este caso, nos piden los datos:
// código, nombre, código externo y descripción de la fábrica
// Por esto solo incluimos esos campos en la interfaz,
//  aunque el backend nos devuelva más datos
export interface Factory {
    id: number;
    code: string;
    name: string;
    externalCode: string;
    description: string;
}