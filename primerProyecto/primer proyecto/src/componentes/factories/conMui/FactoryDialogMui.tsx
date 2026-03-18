import { Factory } from "../../../types/factory";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useState, useEffect } from "react";

interface FactoryDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (factoryData: Partial<Factory>) => void;
    factoryToEdit?: Factory | null;
}


// este componente es un diálogo para crear o editar una fábrica
// le paramos el estado de apertura, una funcion para cerrar el dialog 
// y una funcion para guardar los datos de la fabrica
// Opcionalmente, le pasamos una fabrica a editar
// si no se pasa una fabrica a editar, el formulario se inicia vacio
// y asi se puede usar para crear una nueva fabrica
// ejemplo de uso:
// <FactoryDialogMui
//     open={isDialogOpen}
//     onClose={() => setIsDialogOpen(false)}
//     onSave={(data) => console.log("Guardando fábrica:", data)}
//     factoryToEdit={selectedFactory} // opcional, solo si queremos editar una fábrica existente
// />
// O si queremos crear una nueva fábrica, simplemente no pasamos factoryToEdit o lo dejamos como null
export const FactoryDialogMui = ({ open, onClose, onSave, factoryToEdit }: FactoryDialogProps) => {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        externalCode: "",
        description: ""
    });

    useEffect(() => {
        // cuando se abre el dialog, si hay una fábrica a editar, llenamos el formulario con sus datos
        if (factoryToEdit) {
            setFormData({
                code: factoryToEdit?.code || "",
                name: factoryToEdit?.name || "",
                externalCode: factoryToEdit?.externalCode || "",
                description: factoryToEdit?.description || ""
            });
        } else {
            // si no hay fábrica a editar, limpiamos el formulario para crear una nueva fábrica
            setFormData({
                code: "",
                name: "",
                externalCode: "",
                description: ""
            });
        }
    },
        // el efecto se ejecuta cada vez que cambia la fábrica a editar o el estado de apertura del dialog
        [factoryToEdit, open]);


    // manejamos los cambios en los campos del formulario
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // manejamos el guardado de la fábrica,
    //  llamando a la función onSave con los datos del formulario
    const handleSave = () => {
        onSave(formData);
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle
                sx={{ backgroundColor: "#1b6e1b", color: "white" }}
            >{factoryToEdit ? "Editar Fábrica" : "Crear Fábrica"}</DialogTitle>
            <DialogContent>
                <input
                    type="text"
                    name="code"
                    placeholder="Código"
                    value={formData.code}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="externalCode"
                    placeholder="Código Externo"
                    value={formData.externalCode}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Descripción"
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    {factoryToEdit ? "Guardar" : "Crear"}
                </Button>
            </DialogActions>
        </Dialog>
    );

};