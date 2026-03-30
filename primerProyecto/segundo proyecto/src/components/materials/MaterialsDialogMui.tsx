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
import { useTranslation } from "react-i18next";


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

    const { t } = useTranslation();


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
            code: Yup.string().required(t('common.validation.code_req')),
            name: Yup.string().required(t('common.validation.name_req')),
            measureUnitId: Yup.number().required(t('common.validation.unit_req')),

        }),
        onSubmit: (values) => {
            onSubmit(values);
        }

    });


    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteImg = async () => {
        const uuid = formik.values.imageUuid;
        if (!uuid) return;

        const confirm = window.confirm(t('common.image.delete_confirm'))

        if (!confirm) return;

        setIsDeleting(true);

        try {
            await deleteDocument(uuid.toString());
            formik.setFieldValue("imageUuid", "");
        } catch (error) {
            console.error("Error al borrar la imagen, " + error);
            alert(t('common.image.delete_error'));
        } finally {
            setIsDeleting(false);
        }
    }

    return (

        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {initialValues ? t('materials.dialog.edit_title') : t('materials.dialog.create_title')}
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Box>
                        <Box sx={{ fontWeight: 'bold', mb: 1, color: '#555' }}>{t('materials.dialog.image_title')}</Box>
                        {formik.values.imageUuid ? (
                            // SI TIENE IMAGEN: Mostramos el SecureImage
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1, bgcolor: '#fafafa' }}>

                                <SecureImage
                                    imageId={formik.values.imageUuid}
                                    alt={formik.values.name || t('common.image.alt_material')}
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
                                    {isDeleting ? t('common.status.deleting') : t('common.buttons.delete_image')}
                                </Button>

                            </Box>
                        ) : (
                            <FilePond
                                files={files}
                                onupdatefiles={setFiles}
                                allowMultiple={false}
                                maxFiles={1}
                                name="file"
                                labelIdle={t('common.image.drag_drop')}
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
                            label={t('common.filters.code')}
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            error={formik.touched.code && Boolean(formik.errors.code)}
                            helperText={formik.touched.code && formik.errors.code}
                        />
                        <TextField
                            fullWidth
                            name="name"
                            label={t('common.filters.name')}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth
                            name="externalCode"
                            label={t('common.filters.externalCode')}
                            value={formik.values.externalCode}
                            onChange={formik.handleChange}
                            error={formik.touched.externalCode && Boolean(formik.errors.externalCode)}
                            helperText={formik.touched.externalCode && formik.errors.externalCode}
                        />
                        <TextField
                            fullWidth
                            select
                            name="measureUnitId"
                            label={t('materials.columns.measure_unit')}
                            value={formik.values.measureUnitId || ''}
                            onChange={formik.handleChange}
                            error={formik.touched.measureUnitId && Boolean(formik.errors.measureUnitId)}
                            helperText={formik.touched.measureUnitId && formik.errors.measureUnitId}
                            disabled={loadingUnits}
                        >
                            <MenuItem value="">
                                <em>{t('common.status.select_option')}</em>
                            </MenuItem>
                            {loadingUnits ? (
                                <MenuItem value={formik.values.measureUnitId || ''} disabled> <CircularProgress size={20} />
                                    {t('common.status.loading')}</MenuItem>
                            ) : (
                                units.map((unit) => (
                                    <MenuItem key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>

                        <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
                            <Box sx={{ fontWeight: 'bold', mb: 1 }}>{t('materials.dialog.type_title')}</Box>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}></Box>

                            <FormControlLabel control={<Checkbox name="isRawMaterial" checked={formik.values.isRawMaterial} onChange={formik.handleChange} />} label={t('materials.types.raw')} />
                            <FormControlLabel control={<Checkbox name="isSemifinished" checked={formik.values.isSemifinished} onChange={formik.handleChange} />} label={t('materials.types.semi')} />
                            <FormControlLabel control={<Checkbox name="isFinished" checked={formik.values.isFinished} onChange={formik.handleChange} />} label={t('materials.types.finished')} />
                            <FormControlLabel control={<Checkbox name="isVirtual" checked={formik.values.isVirtual} onChange={formik.handleChange} />} label={t('materials.types.virtual')} />
                        </Box>

                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            name="description"
                            label={t('common.filters.description')}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />


                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            name="observations"
                            label={t('materials.columns.observations')}
                            value={formik.values.observations}
                            onChange={formik.handleChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error">{t('common.buttons.cancel')}</Button>
                    <Button type="submit" variant="contained" color="primary">{t('common.buttons.save')}</Button>
                </DialogActions>

            </form>


        </Dialog >
    );


}

