interface OpcionNav {
    // lo que el usuario ve en la vista en el botón
    // ejemplo: "Home", "Tarea 1", "Tarea 2"
    texto: string;

    // el valor que se usará para controlar el renderizado de la vista, debe ser consistente con las condiciones de renderizado en App.tsx
    // ejemplo: "dashboard", "tarea1", "tarea2"
    vista: string;
}


interface Props {
    // array de opciones de navegación, cada una con su texto y vista correspondiente
    opciones: OpcionNav[];
    // función para cambiar la vista, se pasa desde App.tsx
    cambiarVista: (vista: string) => void;
}

// componente NavBar que recibe las opciones de navegación y la función para cambiar la vista
// las opciones se cargan al llamar al NavBar desde App.tsx, y se renderizan dinámicamente a través del map
// ejemplo de uso:
// <NavBar opciones={[{texto: "Home", vista: "dashboard"}, {texto: "Tarea 1", vista: "tarea1"}, {texto: "Tarea 2", vista: "tarea2"}]} cambiarVista={setVista} />
export const NavBar = ({ opciones, cambiarVista }: Props) => {
    return (
        <nav
            style={{
                display: "flex",
                flexWrap: "wrap",
            }}>
            {/* mostramos un botón para cada opción de navegación */}
            {/* cuando se hace clic en un botón llamamos a la función cambiarVista con la vista correspondiente */}
            {
                opciones.map((opcion, index) => (
                    <button key={index} onClick={() => cambiarVista(opcion.vista)}>
                        {opcion.texto}
                    </button>
                ))
            }
        </nav >
    );
}