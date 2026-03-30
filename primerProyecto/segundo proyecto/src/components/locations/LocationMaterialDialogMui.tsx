import * as Yup from "yup";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControlLabel, Checkbox, Autocomplete, CircularProgress } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import { Material } from "../../types/materials";
import { LocationMaterial } from "../../types/locations";
import { searchMaterials } from "../../api/materialService";
import { SecureImage } from "../common/images/SecureImage";
import { useTranslation } from "react-i18next";

interface Props {
    open: boolean,
    onClose: () => void;
    onSubmit: (values: Partial<LocationMaterial>) => void;
    initialValues?: LocationMaterial | null;
}

export const LocationMaterialDialogMui = ({ open, onClose, onSubmit, initialValues }: Props) => {

    const { t } = useTranslation();
    const [materialsOptions, setMaterialsOptions] = useState<Material[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);

    useEffect(() => {
        if (open) {
            setLoadingMaterials(true);

            searchMaterials({}, 0, 1000, []).then(data => setMaterialsOptions(data.materials)).catch(err => console.error("Error cargando opciones de materiales", err)).finally(() => setLoadingMaterials(false));
        }
    }, [open]);

    const validationSchema = useMemo(
        () =>
            Yup.object({
                materialId: Yup.number()
                    .min(1, t('common.validation.select_material'))
                    .required(t('common.validation.required')),
                unitsToPick: Yup.number()
                    .min(0, t('common.validation.negative_amount'))
                    .required(t('common.validation.required')),
                isDefault: Yup.boolean()
            }),
        [t]
    );

    const formik = useFormik({
        initialValues: initialValues || {
            materialId: 0,
            unitsToPick: 0,
            isDefault: false
        } as unknown as Partial<LocationMaterial>,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        }
    });
    const selectedMaterial = materialsOptions.find(m => m.id === formik.values.materialId) || null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initialValues ? t('location_materials.dialog.edit_title') : t('location_materials.dialog.create_title')}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
                        <Autocomplete
                            options={materialsOptions}
                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
                            value={selectedMaterial}
                            loading={loadingMaterials}

                            disabled={!!initialValues}
                            onChange={(event, newValue) => {
                                formik.setFieldValue("materialId", newValue ? newValue.id : 0);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('location_materials.dialog.material_label')}
                                    error={formik.touched.materialId && Boolean(formik.errors.materialId)}
                                    helperText={formik.touched.materialId && formik.errors.materialId}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loadingMaterials ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        )
                                    }}
                                />
                            )}
                        />
                        {selectedMaterial && selectedMaterial.imageUuid && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2, border: '1px dashed #ccc', borderRadius: 1, bgcolor: '#fafafa' }}>
                                <SecureImage
                                    imageId={selectedMaterial.imageUuid}
                                    alt={selectedMaterial.name}
                                    width={100}
                                    height={100}
                                    clickable
                                />
                            </Box>
                        )}

                        <TextField
                            fullWidth
                            type="number"
                            name="unitsToPick"
                            label={t('location_materials.columns.quantity')}
                            value={formik.values.unitsToPick}
                            onChange={formik.handleChange}
                            inputProps={{ min: 0, step: "any" }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isDefault"
                                    checked={Boolean(formik.values.isDefault)}
                                    onChange={formik.handleChange}
                                />
                            }
                            label={t('location_materials.checkbox_primary_location')}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error">{t('common.buttons.cancel')}</Button>
                    <Button type="submit" variant="contained" color="primary">{t('common.buttons.save')}</Button>

                </DialogActions>
            </form>
        </Dialog>
    )
}