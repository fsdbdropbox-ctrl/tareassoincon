import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { GridRowSelectionModel, GridRowId } from "@mui/x-data-grid";
import { LocationMaterial } from "../types/locations";
import { getLocationMaterials, deleteLocationMaterial } from "../api/locationService";
import { LocationMaterialsTableMui } from "../components/locations/LocationMaterialsTableMui";
import { getMaterialById } from "../api/materialService";
import { addMaterialToLocation, updateLocationMaterial } from "../api/locationService";
import { LocationMaterialDialogMui } from "../components/locations/LocationMaterialDialogMui";
import { getLocationById } from "../api/locationService";
import { MasterLocation } from "../types/MasterLocations";
import { preloadImagesIntoCache } from "../api/documentService";
import { useTranslation } from "react-i18next";

export const LocationMaterials = () => {

    const { t } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();
    const selectedLocationId = Number(id);

    const [materials, setMaterials] = useState<LocationMaterial[]>([]);

    const [locationDetail, setLocationDetail] = useState<MasterLocation | null>(null);

    const [loading, setLoading] = useState(false);

    const [selectedIds, setSelectedIds] = useState<{ ids: Set<GridRowId> }>({
        ids: new Set<GridRowId>()
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<LocationMaterial | null>(null);


    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
        setSelectedIds({ ids: new Set((newSelection as any).ids) })
    }

    const fetchLocationData = useCallback(async () => {
        if (!selectedLocationId) return;
        setLoading(true);
        try {

            const loc = await getLocationById(selectedLocationId);
            setLocationDetail(loc);

            const data = await getLocationMaterials(selectedLocationId);
            const uniqueMaterialIds = Array.from(new Set(data.map(item => item.materialId)));

            const materialsDetails = await Promise.all(
                uniqueMaterialIds.map(matId =>
                    getMaterialById(matId).catch(() => null)
                )
            );

            const materialDic = new Map();
            materialsDetails.forEach(mat => {
                if (mat) materialDic.set(mat.id, mat);
            });

            const detailedMaterialsData = data.map(item => {
                const materialInfo = materialDic.get(item.materialId);
                return {
                    ...item,
                    materialCode: materialInfo ? materialInfo.code : t('common.status.na'),
                    materialName: materialInfo ? materialInfo.name : t('common.status.unknown'),
                    externalCode: materialInfo ? materialInfo.externalCode : "",
                    description: materialInfo ? materialInfo.description : "",
                    measureUnitId: materialInfo ? materialInfo.measureUnitId : "",
                    observations: materialInfo ? materialInfo.observations : "",

                    isRawMaterial: materialInfo ? materialInfo.isRawMaterial : false,
                    isSemifinished: materialInfo ? materialInfo.isSemifinished : false,
                    isFinished: materialInfo ? materialInfo.isFinished : false,
                    isVirtual: materialInfo ? materialInfo.isVirtual : false,

                    imageUuid: materialInfo ? materialInfo.imageUuid : null,
                };
            });
            const uuidsToFetch = detailedMaterialsData.map((m) => m.imageUuid).filter((uuid) => uuid && uuid.trim() !== "");
            if (uuidsToFetch.length > 0) {
                preloadImagesIntoCache(uuidsToFetch);
            }
            setMaterials(detailedMaterialsData as any);

        } catch (error) {
            console.error(`Error cargando materiales: `, error);
        } finally {
            setLoading(false);
        }
    }, [selectedLocationId, t]);

    useEffect(() => {
        fetchLocationData();
    }, [fetchLocationData]);

    const handleDeleteSelected = async () => {
        const confirm = window.confirm(t('common.alerts.delete_confirm_count', { count: selectedIds.ids.size }));
        if (!confirm) return;
        setLoading(true);
        try {
            await Promise.all(Array.from(selectedIds.ids).map(delId => deleteLocationMaterial(Number(delId))));
            fetchLocationData();
        } catch (error) {
            alert(t('common.alerts.delete_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setItemToEdit(null);
        setIsDialogOpen(true);
    }

    const handleEditClick = (item: LocationMaterial) => {
        setItemToEdit(item);
        setIsDialogOpen(true);
    }

    const handleSave = async (values: Partial<LocationMaterial>) => {
        setLoading(true);
        try {
            if (itemToEdit && itemToEdit.id) {
                const payload: any = {
                    ...itemToEdit,
                    unitsToPick: Number(values.unitsToPick),
                    isDefault: Boolean(values.isDefault),
                };

                delete payload.materialName;
                delete payload.materialCode;
                await updateLocationMaterial(itemToEdit.id, payload);
            } else {
                const payload: any = {
                    locationId: selectedLocationId,
                    materialId: values.materialId,
                    unitsToPick: Number(values.unitsToPick),
                    isDefault: Boolean(values.isDefault),
                    active: true,
                };
                await addMaterialToLocation(payload);
            }

            setIsDialogOpen(false);
            await fetchLocationData();

        } catch (error) {
            console.error("Error guardando la relación: ", error)
            alert(t('common.alerts.save_error'));
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box sx={{ width: "100%", height: "100%" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
                <Button variant="outlined" onClick={() => navigate("/locations")}>
                    {t('common.buttons.back')}
                </Button>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                    {t('location_materials.view_title')} {locationDetail?.name || t('common.status.loading')}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {t('common.filters.code')}: {locationDetail?.code || "---"} | {t('common.labels.id')}: {selectedLocationId}
                </Typography>
            </Box>

            <LocationMaterialsTableMui
                data={materials}
                loading={loading}
                selectedIds={{ type: "include", ids: selectedIds.ids }}
                onSelectionChange={setSelectedIds}
                onAddClick={handleAddClick}
                onDeleteSelected={handleDeleteSelected}
                onEditClick={handleEditClick}
            />

            <LocationMaterialDialogMui
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSave}
                initialValues={itemToEdit}
            />
        </Box>
    );
};