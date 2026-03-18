import { useState } from "react";

// exportamos la interfaz FactoryFilterValues 
// para tipar los valores del filtro
export interface FactoryFilterValues {
    code: string;
    name: string;
    externalCode: string;
    description: string;
}

// definimos los props del componente FactoryFilter
// onFilter es una función que se ejecuta cuando se aplica el filtro,
//  recibe los valores del filtro como argumento
// cuando se le de al botón de aplicar filtro,
//  se ejecutará la función onFilter
interface FactoryFilterProps {
    onFilter: (values: FactoryFilterValues) => void;
}

// este componente se encarga de mostrar el formulario de filtro,
//  con los campos de código, nombre, código externo y descripción,
//  y un botón para aplicar el filtro
export const FactoryFilter = ({ onFilter }: FactoryFilterProps) => {
    // botón para mostrar u ocultar el filtro
    const [boolInvisible, setBoolInvisible] = useState(false);

    // usamos useState para almacenar los valores del filtro,
    //  inicializamos el estado con un objeto vacío,
    //  ya que al principio no tenemos valores
    const [filters, setFilters] = useState<FactoryFilterValues>({
        code: "",
        name: "",
        externalCode: "",
        description: ""
    });

    // función para manejar el cambio en los campos del filtro,
    //  actualiza el estado con los nuevos valores
    // React.ChangeEvent<HTMLInputElement> es el tipo de evento que ocurre 
    //  cuando se cambia el valor de un input
    // funciona para todos los campos del filtro,
    //  ya que el name del input coincide con la propiedad del estado
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // extraemos el name y el value del input que se ha cambiado
        // se les asigna el name del input al name de la propiedad del estado,
        //  y el value del input al value de la propiedad del estado
        // por ejemplo, si se cambia el campo de código, el name será "code",
        //  y el value será el nuevo valor del campo de código
        const { name, value } = e.target;

        // actualizamos el estado con los nuevos valores,
        //  utilizando el operador spread para mantener los valores anteriores,
        //  y solo actualizar el campo que ha cambiado
        // usamos ...filters porque ... nos permite mantener los valores 
        // anteriores del estado,
        //  y solo actualizar el campo que ha cambiado
        // por ejemplo, si se cambia el campo de código,
        //  solo se actualizará el campo de código,
        //  y los demás campos del filtro se mantendrán con sus valores
        //  anteriores
        setFilters({
            ...filters,
            [name]: value
        });
    };


    // función para vaciar los campos del filtro,
    //  se ejecuta cuando se le da al botón de limpiar filtro
    // al igual que handleInputChange, se actualiza el estado con un objeto vacío,
    //  lo que hace que los campos del filtro se vacíen
    const handleClearFilters = () => {

        // definimos un objeto vacío con los mismos campos que el estado,
        //  para vaciar los campos del filtro
        const emptyFilters = {
            code: "",
            name: "",
            externalCode: "",
            description: ""
        };

        // actualizamos el estado con el objeto vacío
        // esto hará que los campos del filtro se vacíen,
        //  ya que el estado se actualiza con un objeto vacío
        setFilters(emptyFilters);
        // también podemos ejecutar la función onFilter con el objeto vacío,
        //  para que se aplique el filtro vacío y se muestren todos los resultados
        onFilter(emptyFilters);
    };


    // lo qeue se muestra en el return es un botón para mostrar u ocultar el filtro,
    //  y si el filtro está visible, se muestran los campos del filtro y el botón de limpiar filtro
    return (
        <div>
            {/* Botón para mostrar u ocultar el filtro */}
            <button onClick={() => setBoolInvisible(!boolInvisible)}>
                {/* Operador ternario para mostrar u ocultar el filtro */}
                {!boolInvisible ? "Mostrar Filtro" : "Ocultar Filtro"}
            </button>

            {boolInvisible && (
                <div>
                    <div>
                        <input
                            type="text"
                            name="code"
                            placeholder="Código"
                            value={filters.code}
                            onChange={handleInputChange} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            value={filters.name}
                            onChange={handleInputChange} />
                        <input
                            type="text"
                            name="externalCode"
                            placeholder="Código Externo"
                            value={filters.externalCode}
                            onChange={handleInputChange} />
                        <input
                            type="text"
                            name="description"
                            placeholder="Descripción"
                            value={filters.description}
                            onChange={handleInputChange} />
                    </div>
                    <div>
                        {/* Botón para aplicar el filtro */}
                        <button onClick={() => onFilter(filters)}>Aplicar Filtro</button>
                        {/* cuando el filtro está visible aparecerán todos los campos */}
                        <button onClick={handleClearFilters}>Limpiar Filtro</button>
                    </div>
                </div>
            )}


        </div >
    );

}

