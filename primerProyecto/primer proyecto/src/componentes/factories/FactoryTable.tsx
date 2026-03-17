// este componente se encarga de mostrar la tabla de fábricas,
//  utilizando el servicio de fábrica para obtener los datos
//  y renderizarlos en una tabla.
// se importa la interfaz Factory para tipar los datos que
//  se reciben del servicio
import { Factory } from "../../types/factory";

// definmos los props, en este caso un array de fábricas
//  que se espera recibir del componente padre
//ejemplo de uso:
// <FactoryTable factories={factories} /> en /src/App.tsx
// resultado esperado: una tabla con los datos de las fábricas,
//  mostrando las columnas de código, nombre, código externo y descripción
interface FactoryTableProps {
    factories: Factory[];
}

// recibe el array de fábricas y los carga en la tabla
// ejemplo de valor recibido:
// [
//     {    
//         "id": 39,
//         "code": "rtwth",
//         "name": "yjy",
//         "externalCode": "yjyt",
//         "description": "yjty"
//     },
//     {
//         "id": 40,
//         ...
// }
// ]
export const FactoryTable = ({ factories }: FactoryTableProps) => {
    return (
        // da error por el border, pero realmente no es importante,
        //  lo importante es mostrar los datos en la tabla
        <table border="1" width="100%" textAlign="left" >
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Código Externo</th>
                    <th>Descripción</th>
                </tr>
            </thead>
            <tbody>
                {factories.map(factory => (
                    <tr key={factory.id}>
                        <td>{factory.code}</td>
                        <td>{factory.name}</td>
                        <td>{factory.externalCode}</td>
                        <td>{factory.description}</td>
                    </tr>
                ))}
            </tbody>
        </table >
    );
}