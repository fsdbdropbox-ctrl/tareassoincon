// importamos useState y useEffect para manejar el estado y los efectos secundarios
// ejemplos de uso:
// useState: const [factories, setFactories] = useState<Factory[]>([]);
// useEffect: useEffect(() => { ... }, []);
import { useState, useEffect } from "react";

// importamos la función getFactories para obtener los datos de las fábricas
// ejemplo de uso:
// getFactories(1)
//     .then(factories => setFactories(factories))
//     .catch(error => console.error("Error fetching factories:", error));
import { getFactories } from "../api/factoryService";
// importamos la interfaz Factory para tipar los datos que recibimos del servicio
// ejemplo de uso:
// const [factories, setFactories] = useState<Factory[]>([]);
import { Factory } from "../types/factory";
// importamos el componente FactoryTable para mostrar los datos en una tabla
// ejemplo de uso:
// <FactoryTable factories={factories} /> en el return del componente
import { FactoryTable } from "../componentes/factories/FactoryTable";
// importamos el componente FactoryFilter para mostrar el formulario de filtro
// ejemplo de uso:
// <FactoryFilter onFilter={handleFilter} /> en el return del componente
import { FactoryFilter, FactoryFilterValues } from "../componentes/factories/FactoryFilter";




export const Tarea1 = () => {

    // usamos useState para almacenar las fábricas que recibimos del backend
    // inicializamos el estado con un array vacío,
    //  ya que al principio no tenemos datos
    // después tendrámos un array de objetos que cumplen con la interfaz Factory
    // datos que recibimos del backend: código, nombre, código externo y descripción de la fábrica
    // para recibir más datos del backend, solo tenemos que agregar los
    //  campos correspondientes en la interfaz Factory 
    // /types/factory.ts, aunque el backend nos devuelva más datos,
    //  nosotros solo almacenamos los que necesitamos
    const [factories, setFactories] = useState<Factory[]>([]);






    const [displayedFactories, setDisplayedFactories] = useState<Factory[]>([]);






    // usamos useEffect para hacer la petición al backend
    //  cuando el componente se monta
    // ejemplo de uso:
    // getFactories(1)
    //     .then(factories => setFactories(factories))
    //     .catch(error => console.error("Error fetching factories:", error));
    useEffect(() => {
        getFactories(1)
            .then(factories => {
                setFactories(factories);
                setDisplayedFactories(factories);
            })
            .catch(error => console.error("Error fetching factories:", error));
    }, []);


    const handleApplyFilter = (filters: FactoryFilterValues) => {

        if (factories.length === 0) return;

        const filteredFactories = factories.filter(factory => {

            const codeMatch = (factory.code || "").toLowerCase().includes(filters.code.toLowerCase());
            const nameMatch = (factory.name || "").toLowerCase().includes(filters.name.toLowerCase());
            const externalCodeMatch = (factory.externalCode || "").toLowerCase().includes(filters.externalCode.toLowerCase());
            const descriptionMatch = (factory.description || "").toLowerCase().includes(filters.description.toLowerCase());

            return codeMatch && nameMatch && externalCodeMatch && descriptionMatch;
        });

        setDisplayedFactories(filteredFactories);
    };

    return (
        <div>
            <h1>Tarea 1</h1>
            <p>Formulario con un filtro que muestra u oculta el filtro, hacemos una peticion y debemos mostrar código, nombre, código externo y descripción.</p>

            {/* llamamos al componente FactoryFilter y le pasamos la función handleApplyFilter */}
            <FactoryFilter onFilter={handleApplyFilter} />

            {/* llamamos al componente FactoryTable y
             le pasamos el array de fábricas */}
            <FactoryTable factories={displayedFactories} />
        </div>
    );
}