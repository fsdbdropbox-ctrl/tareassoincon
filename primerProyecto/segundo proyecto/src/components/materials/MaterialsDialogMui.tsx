import * as Yup from "yup";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, TextField, Box, FormControlLabel, Checkbox, MenuItem, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Material } from "../../types/materials";
import { useFormik } from "formik";
import { getMeasureUnits } from "../../api/measureUnitService";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { processFileUpload, deleteDocument } from "../../api/documentService";

import { SecureImage } from "../common/images/SecureImage";

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
);

interface Props {

    open: boolean,
    onClose: () => void,
    onSubmit: (values: Partial<Material>) => void,
    initialValues?: Material | null;
}


export const MaterialDialogMui = ({ open, onClose, onSubmit, initialValues }: Props) => {

    const [units, setUnits] = useState<{ id: number, name: string }[]>([]);
    const [loadingUnits, setLoadingUnits] = useState(false);
    //filepond
    const [files, setFiles] = useState<any[]>([]);

    useEffect(() => {

        if (open) {

            setLoadingUnits(true);
            getMeasureUnits(1)
                .then(data => setUnits(data))
                .finally(() => setLoadingUnits(false))
            // limpiamos la vista de FilePond al abrir un nuevo diálogo
            setFiles([]);
        }
    }, [open]);


    const formik = useFormik({
        initialValues: initialValues || {
            code: "",
            name: "",
            externalCode: "",
            description: "",
            measureUnitId: "",
            isVirtual: false,
            isRawMaterial: false,
            isSemifinished: false,
            isFinished: false,
            observations: ""
        } as unknown as Partial<Material>,
        enableReinitialize: true,
        validationSchema: Yup.object({
            code: Yup.string().required("El código es requerido"),
            name: Yup.string().required("El nombre es requerido"),
            measureUnitId: Yup.number().required("La unidad de medida es requerida"),

        }),
        onSubmit: (values) => {
            onSubmit(values);
        }

    });


    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteImg = async () => {
        const uuid = formik.values.imageUuid;
        if (!uuid) return;

        const confirm = window.confirm("¿Seguro que quieres borrar la imagen del material de la base de datos?")
        if (!confirm) return;

        setIsDeleting(true);

        try {
            await deleteDocument(uuid.toString());
            formik.setFieldValue("imageUuid", "");
        } catch (error) {
            console.error("Error al borrar la imagen, " + error);
            alert("Hubo un error al intentar la imagen del servidor")
        } finally {
            setIsDeleting(false);
        }
    }

    return (

        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">            <DialogTitle>{initialValues ? "Editar Material General" : "Nuevo Material"}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Box>
                        <Box sx={{ fontWeight: 'bold', mb: 1, color: '#555' }}>Imagen del Material</Box>
                        {formik.values.imageUuid ? (
                            // SI TIENE IMAGEN: Mostramos el SecureImage
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1, bgcolor: '#fafafa' }}>

                                <SecureImage
                                    imageId={formik.values.imageUuid}
                                    alt={formik.values.name || "Material"} // Usa el nombre si lo tienes en el formik
                                    width={150}
                                    height={150}
                                    clickable
                                />

                                <Button
                                    color="error"
                                    variant="outlined"
                                    onClick={handleDeleteImg}
                                    disabled={isDeleting}
                                    sx={{ mt: 1 }}
                                >
                                    {isDeleting ? "Borrando de la BBDD..." : "Eliminar Imagen"}
                                </Button>

                            </Box>
                        ) : (
                            <FilePond
                                files={files}
                                onupdatefiles={setFiles}
                                allowMultiple={false}
                                maxFiles={1}
                                name="file"
                                labelIdle='Arrastra tu imagen o <span class="filepond--label-action">Insertar</span>'
                                acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'image/jpg']}
                                allowFileSizeValidation={true}
                                maxFileSize="5MB"

                                server={{
                                    process: processFileUpload,

                                    revert: (uniqueFileId, load, error) => {
                                        formik.setFieldValue("imageUuid", null);
                                        load();
                                    }

                                }}

                                onprocessfile={(error, file) => {
                                    if (!error) {
                                        formik.setFieldValue("imageUuid", file.serverId);
                                    }
                                }}
                            />
                        )}
                        < TextField
                            fullWidth
                            name="code"
                            label="code"
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            error={formik.touched.code && Boolean(formik.errors.code)}
                            helperText={formik.touched.code && formik.errors.code}
                        />
                        <TextField
                            fullWidth
                            name="name"
                            label="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth
                            name="externalCode"
                            label="Código Externo"
                            value={formik.values.externalCode}
                            onChange={formik.handleChange}
                            error={formik.touched.externalCode && Boolean(formik.errors.externalCode)}
                            helperText={formik.touched.externalCode && formik.errors.externalCode}
                        />
                        <TextField
                            fullWidth
                            select
                            name="measureUnitId"
                            label="Unidad de medida"
                            value={formik.values.measureUnitId || ''}
                            onChange={formik.handleChange}
                            error={formik.touched.measureUnitId && Boolean(formik.errors.measureUnitId)}
                            helperText={formik.touched.measureUnitId && formik.errors.measureUnitId}
                            disabled={loadingUnits}
                        >
                            <MenuItem value="">
                                <em>Seleccione una unidad...</em>
                            </MenuItem>
                            {loadingUnits ? (
                                <MenuItem value={formik.values.measureUnitId || ''} disabled> <CircularProgress size={20} />
                                    cargando...</MenuItem>
                            ) : (
                                units.map((unit) => (
                                    <MenuItem key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>

                        <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
                            <Box sx={{ fontWeight: 'bold', mb: 1 }}>Tipo de Material</Box>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}></Box>

                            <FormControlLabel control={<Checkbox name="isRawMaterial" checked={formik.values.isRawMaterial} onChange={formik.handleChange} />} label="Materia Prima" />
                            <FormControlLabel control={<Checkbox name="isSemifinished" checked={formik.values.isSemifinished} onChange={formik.handleChange} />} label="Semielaborado" />
                            <FormControlLabel control={<Checkbox name="isFinished" checked={formik.values.isFinished} onChange={formik.handleChange} />} label="Producto Terminado" />
                            <FormControlLabel control={<Checkbox name="isVirtual" checked={formik.values.isVirtual} onChange={formik.handleChange} />} label="Es Virtual" />
                        </Box>

                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            name="description"
                            label="Descripción"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />


                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            name="observations"
                            label="Observaciones"
                            value={formik.values.observations}
                            onChange={formik.handleChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error">Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary">Guardar</Button>
                </DialogActions>

            </form>


        </Dialog >
    );










}

export const materialValidationSchema = Yup.object().shape({
    code: Yup.string().required("El código es requerido"),
    name: Yup.string().required("El nombre es requerido"),
    measureUnitId: Yup.number().required("La unidad de medida es requerida"),

    isVirtual: Yup.boolean().required("El tipo es requerido"),
    isRawMaterial: Yup.boolean().required("El tipo es requerido"),
    isSemifinished: Yup.boolean().required("El tipo es requerido"),
    isFinished: Yup.boolean().required("El tipo es requerido"),
});