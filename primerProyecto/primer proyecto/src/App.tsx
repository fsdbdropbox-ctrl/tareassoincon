import { useState } from 'react';
import './App.css';
import { Home } from './pages/Home';
import { Tarea1 } from './pages/Tarea1';
import { Tarea2 } from './pages/Tarea2';
import { NavBar } from './componentes/menuNavegacion/NavBar';
function App() {

  // estado para controlar la vista actual
  // vista es el valor actual de la vista, setVista es la función para actualizarlo
  // inicializamos la vista con 'dashboard' para mostrar el dashboard por defecto
  // dashboard es solo un nombre, podría ser cualquier otro,
  //  lo importante es que sea consistente con las condiciones de renderizado
  const [vista, setVista] = useState('dashboard');

  return (
    <>
      <div>
        {/* Primera prueba de llamada a un componente /componentes/boton/MyButton */}
        {/* <MyButton texto="Guardar" />
        <MyButton texto="Cancelar" /> */}


        {/*
         Renderizado dinamico de la vista
          Si vista es 'dashboard', se muestra el Home
          Si vista es 'tarea1', se muestra el componente Tarea1
          Si vista es 'tarea2', se muestra el componente Tarea2
          esto se hace a traves del setVista,
          que se actualiza al hacer click en los botones de navegación
          */}


        <NavBar opciones={[
          { texto: "Home", vista: "dashboard" },
          { texto: "Tarea 1", vista: "tarea1" },
          { texto: "Tarea 2", vista: "tarea2" }
        ]} cambiarVista={setVista} />

        {vista === 'dashboard' && <Home />}
        {vista === 'tarea1' && <Tarea1 />}
        {vista === 'tarea2' && <Tarea2 />}

      </div>
    </>
  )
}

export default App
