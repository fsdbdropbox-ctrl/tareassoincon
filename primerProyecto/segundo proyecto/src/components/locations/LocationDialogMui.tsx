import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, FormControlLabel, Checkbox, Switch, Typography
} from "@mui/material";
import { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { MasterLocation } from "../../types/MasterLocations";

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { processFileUpload } from "../../api/documentService";


registerPlugin(FilePondPluginImagePreview);

interface LocationDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (locationData: Partial<MasterLocation>) => void;
    locationToEdit?: MasterLocation | null;
}

export const LocationDialogMui = ({ open, onClose, onSave, locationToEdit }: LocationDialogProps) => {


    const validationSchema = Yup.object().shape({
        code: Yup.string().required("El código es requerido"),
        name: Yup.string().required("El nombre es requerido"),
        externalCode: Yup.string().nullable(),
        description: Yup.string().nullable()
    });

    const formik = useFormik({

        initialValues: {
            code: locationToEdit?.code || "",
            name: locationToEdit?.name || "",
            externalCode: locationToEdit?.externalCode || "",
            description: locationToEdit?.description || "",
            allowStorage: locationToEdit ? Boolean(locationToEdit.allowStorage) : false,
            allowOtherMaterials: locationToEdit ? Boolean(locationToEdit.allowOtherMaterials) : false,
            allowMaterialRequests: locationToEdit ? Boolean(locationToEdit.allowMaterialRequests) : false,
            imageUuid: locationToEdit?.imageUuid || ""
        } as Partial<MasterLocation>,

        validationSchema: validationSchema,
        enableReinitialize: true,

        onSubmit: (values) => {
            onSave(values);
        }
    });

    useEffect(() => {
        if (open && !locationToEdit) {
            formik.resetForm();
        }
    }, [open, locationToEdit]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ backgroundColor: "#1b6e1b", color: "white" }}>
                {locationToEdit ? "Editar Localización" : "Crear Localización"}
            </DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                {locationToEdit?.imageUuid ? "Sustituir Imagen Actual" : "Subir Imagen de la Localización"}
                            </Typography>
                            <FilePond
                                allowMultiple={false}
                                maxFiles={1}
                                name="file"
                                labelIdle='Arrastra tu imagen o <span class="filepond--label-action">Examina</span>'
                                server={{
                                    process: (fieldName, file, metadata, load, error, progress, abort) => {
                                        return processFileUpload(fieldName, file, metadata, load, error, progress, abort);
                                    }
                                }}
                                onprocessfile={(error, file) => {
                                    if (!error) {
                                        formik.setFieldValue("imageUuid", file.serverId);
                                    }
                                }}
                                onremovefile={() => {
                                    formik.setFieldValue("imageUuid", "");
                                }}
                            />
                        </Box>

                        <TextField
                            type="text"
                            name="code"
                            label="Código *"
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.code && Boolean(formik.errors.code)}
                            helperText={formik.touched.code && formik.errors.code}
                            disabled={!!locationToEdit}
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
                        />
                        <TextField
                            type="text"
                            name="description"
                            label="Descripción"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />


                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pl: 1 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="allowStorage"
                                        checked={Boolean(formik.values.allowStorage)}
                                        onChange={formik.handleChange}
                                        color="primary"
                                    />
                                }
                                label="Permite Almacenar"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="allowMaterialRequests"
                                        checked={Boolean(formik.values.allowMaterialRequests)}
                                        onChange={formik.handleChange}
                                        color="primary"
                                    />
                                }
                                label="Permite Solicitudes"
                            />
                            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                <Typography color={formik.values.allowOtherMaterials ? "textSecondary" : "textPrimary"}>
                                    Ordenada
                                </Typography>
                                <Switch
                                    name="allowOtherMaterials"
                                    checked={Boolean(formik.values.allowOtherMaterials)}
                                    onChange={formik.handleChange}
                                    color="warning"
                                />
                                <Typography color={formik.values.allowOtherMaterials ? "textPrimary" : "textSecondary"}>
                                    Caótica
                                </Typography>
                            </Box>
                        </Box>

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error">Cancelar</Button>
                    <Button onClick={() => formik.resetForm()} type="reset" variant="outlined" color="secondary">
                        Limpiar
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {locationToEdit ? "Guardar Cambios" : "Crear Localización"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};