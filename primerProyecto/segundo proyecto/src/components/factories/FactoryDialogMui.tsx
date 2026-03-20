import { Factory } from "../../../types/factory";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Box } from "@mui/material";

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

    // validadores con Yup
    const validationSchema = Yup.object().shape({
        code: Yup.string().required("El código es requerido"),
        name: Yup.string().required("El nombre es requerido"),
        externalCode: Yup.string().nullable("Opcional"),
        description: Yup.string().nullable("Opcional")
    });


    const formik = useFormik({
        initialValues: {
            code: factoryToEdit?.code || "",
            name: factoryToEdit?.name || "",
            externalCode: factoryToEdit?.externalCode || "",
            description: factoryToEdit?.description || ""
        },
        validationSchema: validationSchema,

        enableReinitialize: true,
        onSubmit: (values) => {
            onSave(values);
        }
    });


    useEffect(() => {
        // cuando se abre el dialog, si hay una fábrica a editar, llenamos el formulario con sus datos
        if (open) {
            if (factoryToEdit) {
                formik.setValues({
                    code: factoryToEdit?.code || "",
                    name: factoryToEdit?.name || "",
                    externalCode: factoryToEdit?.externalCode || "",
                    description: factoryToEdit?.description || ""
                });
            } else {
                formik.resetForm();
            }
        }
    }, [factoryToEdit, open]);
    // el efecto se ejecuta cada vez que cambia la fábrica a editar o el estado de apertura del dialog


    // manejamos los cambios en los campos del formulario
    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     formik.setFieldValue(name, value);
    // };

    // manejamos el guardado de la fábrica,
    //  llamando a la función onSave con los datos del formulario
    // const handleSave = () => {
    //     formik.handleSubmit();
    // }






    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle
                sx={{ backgroundColor: "#1b6e1b", color: "white" }}
            >{factoryToEdit ? "Editar Fábrica" : "Crear Fábrica"}</DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            type="text"
                            name="code"
                            label="Código *"
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.code && Boolean(formik.errors.code)}
                            helperText={formik.touched.code && formik.errors.code}
                        />
                        <TextField
                            type="text"
                            name="name"
                            label="Nombre *"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            type="text"
                            name="externalCode"
                            label="Código Externo"
                            value={formik.values.externalCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.externalCode && Boolean(formik.errors.externalCode)}
                            helperText={formik.touched.externalCode && formik.errors.externalCode}
                        />
                        <TextField
                            type="text"
                            name="description"
                            label="Descripción"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {factoryToEdit ? "Guardar" : "Crear"}
                    </Button>
                    <Button onClick={() => formik.resetForm()} type="reset" variant="contained" color="primary">
                        Limpiar
                    </Button>
                </DialogActions>
            </form>

        </Dialog>
    );

};