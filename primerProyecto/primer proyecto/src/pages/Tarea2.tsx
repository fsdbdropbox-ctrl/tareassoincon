import { useState, useEffect } from "react";
import { searchFactories } from "../api/factoryService";
import { Factory } from "../types/factory";
import { FactoryTableMui } from "../componentes/factories/conMui/FactoryTableMui";
import { FactoryFilter, FactoryFilterValues } from "../componentes/factories/sinMui/FactoryFilter";



export const Tarea2 = () => {

    // solo necesitamos un estado,
    //  ya que el back será quien decida qué fábricas
    //  mostrar según los filtros que le enviemos,
    // por lo que no necesitamos un estado para almacenar las fábricas
    //  sin filtrar
    const [factories, setFactories] = useState<Factory[]>([]);


    useEffect(() => {
        // hacemos una búsqueda inicial sin filtros para mostrar todas
        //  las fábricas
        searchFactories(1, {})
            .then(factories => setFactories(factories))
            .catch(error => console.error("Error fetching factories:", error));
    }, []);

    const handleFilter = async (filters: FactoryFilterValues) => {
        try {
            const filteredFactories = Object.fromEntries(
                Object.entries(filters).filter(([key, value]) => value !== "")
            );
            const results = await searchFactories(1, filteredFactories);
            setFactories(results);
        }
        catch (error) {
            console.error("Error fetching factories:", error);
        }

    }


    return (
        <div>
            <h1>Tarea 2 con post Search Factory</h1>
            <p>Tabla con Material UI y filtrado en el BackEnd en vez del Front</p>

            <FactoryFilter onFilter={handleFilter} />
            <FactoryTableMui factories={factories || []} />
        </div>
    );
}