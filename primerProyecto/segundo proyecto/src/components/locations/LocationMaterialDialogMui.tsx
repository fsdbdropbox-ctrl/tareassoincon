import * as Yup from "yup";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControlLabel, Checkbox, Autocomplete, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Material } from "../../types/materials";
import { LocationMaterial } from "../../types/locations";
import { searchMaterials } from "../../api/materialService";

interface Props {
    open: boolean,
    onClose: () => void;
    onSubmit: (values: Partial<LocationMaterial>) => void;
    initialValues?: LocationMaterial | null;
}

export const LocationMaterialDialogMui = ({ open, onClose, onSubmit, initialValues }: Props) => {

    const [materialsOptions, setMaterialsOptions] = useState<Material[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);

    useEffect(() => {
        if (open) {
            setLoadingMaterials(true);

            searchMaterials({}, 0, 1000, []).then(data => setMaterialsOptions(data.materials)).catch(err => console.error("Error cargando opciones de materiales", err)).finally(() => setLoadingMaterials(false));
        }
    }, [open]);

    const formik = useFormik({
        initialValues: initialValues || {
            materialId: 0,
            unitsToPick: 0,
            isDefault: false
        } as unknown as Partial<LocationMaterial>,
        enableReinitialize: true,
        validationSchema: Yup.object({
            materialId: Yup.number().min(1, "Debe seleccionar un material").required("Obligatorio"),
            unitsToPick: Yup.number().min(0, "La cantidad no puede ser negativa").required("Obligatorio"),
            isDefault: Yup.boolean()
        }),
        onSubmit: (values) => {
            onSubmit(values);
        }
    });
    const selectedMaterial = materialsOptions.find(m => m.id === formik.values.materialId) || null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initialValues ? "Editar Asignación" : "Asignar Material a la Localización"}</DialogTitle>
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
                                    label="Material"
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

                        <TextField
                            fullWidth
                            type="number"
                            name="unitsToPick"
                            label="Cantidad"
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
                            label="Ubicacion Principal"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error">Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary">Guardar</Button>

                </DialogActions>
            </form>
        </Dialog>
    )
}