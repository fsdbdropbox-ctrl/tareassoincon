import { useState, useEffect, useCallback } from "react";
import { GridSortModel, GridRowSelectionModel, GridRowId } from "@mui/x-data-grid";
import { Material, MaterialFilter } from "../types/materials";
import { searchMaterials, deleteMaterial, updateMaterial, createMaterial } from "../api/materialService";
import { MaterialTableMui } from "../components/materials/MaterialTableMui";
import { Box, Typography } from "@mui/material";
import { MaterialDialogMui } from "../components/materials/MaterialsDialogMui";
import { preloadImagesIntoCache } from "../api/documentService";
import { GeneralFilter, GeneralFilterValues } from "../components/common/filters/GeneralFilter";
import { useStompoStock } from "../hooks/useStompStock";
import { useTranslation } from "react-i18next";

export const MaterialsView = () => {

    const { t } = useTranslation();

    // Tabla
    const [materials, setMaterials] = useState<Material[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [materialsToEdit, setMaterialsToEdit] = useState<Material | null>(null);

    // Paginacion Server
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    });

    const [sortModel, setSortModel] = useState<GridSortModel>([]);

    const [selectedRowIds, setSelectedRowIds] = useState<{ ids: Set<GridRowId> }>({
        ids: new Set<GridRowId>()
    });

    const [currentFilters, setCurrentFilters] = useState<GeneralFilterValues>({
        code: "",
        name: "",
        externalCode: "",
        description: ""
    });

    const stockMap = useStompoStock('/topic/updateui')

    const handleApplyFilters = (values: GeneralFilterValues) => {
        setCurrentFilters(values);
        setPaginationModel((prev) => ({ ...prev, page: 0 }))
    }


    const fetchMaterialsData = useCallback(async () => {
        setLoading(true);
        try {
            const apiFilters: MaterialFilter = {
                code: currentFilters.code,
                name: currentFilters.name,
                description: currentFilters.description,
                externalCode: currentFilters.externalCode
            }

            const { materials, total } = await searchMaterials(
                apiFilters,
                paginationModel.page,
                paginationModel.pageSize,
                sortModel
            );


            const uuidsToFetch = materials
                .map((item) => item.imageUuid)
                .filter((uuid) => uuid && uuid.trim() !== "");
            if (uuidsToFetch.length > 0) {
                preloadImagesIntoCache(uuidsToFetch);
            }
            setMaterials(materials);
            setRowCount(total);
        } catch (error) {
            console.error("Error al cargar los materiales:", error);
        } finally {
            setLoading(false);
        }
    }, [paginationModel.page, paginationModel.pageSize, currentFilters, sortModel]);

    useEffect(() => {
        fetchMaterialsData();
    }, [fetchMaterialsData]);


    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
        setSelectedRowIds({ ids: new Set(newSelection.ids) });
    };

    const handleAddClick = () => {
        setMaterialsToEdit(null);
        setIsDialogOpen(true);
    }

    const handleEditClick = (material: Material) => {
        setMaterialsToEdit(material);
        setIsDialogOpen(true);
    }

    const handleDeleteSelected = async () => {
        const confirmacion = window.confirm(t('common.alerts.delete_confirm_count', { count: selectedRowIds.ids.size }));
        if (!confirmacion) return;
        setLoading(true);
        try {
            // Convertimos el Set a un Array para poder iterar y borrar
            const idsArray = Array.from(selectedRowIds.ids);
            await Promise.all(idsArray.map(id => deleteMaterial(Number(id))));

            alert(t('common.alerts.delete_success'));
            setSelectedRowIds({ ids: new Set() }); // Limpiar selección
            fetchMaterialsData(); // Recargar la tabla
        } catch (error) {
            console.error("Error al borrar:", error);
            alert(t('common.alerts.delete_error_in_use'));
        } finally {
            setLoading(false);
        }
    };


    const handleSaveMaterial = async (materialData: Partial<Material>) => {
        setLoading(true);

        try {

            const { createAt, modifiedAt, modifiedBy, ...payloadToSave } = materialData as any;

            if (materialsToEdit && materialsToEdit.id) {
                await updateMaterial(materialsToEdit.id, payloadToSave);

            } else {
                await createMaterial(payloadToSave);
            }

            setIsDialogOpen(false);
            alert(t('common.alerts.save_success'));
            fetchMaterialsData();


        } catch (error) {
            console.error("Error al guardar el material:", error);
            alert(t('common.alerts.save_error'));
        } finally { setLoading(false); }

    }

    return (
        <Box sx={{ width: "100%", height: "100%" }}>
            <Typography variant="h4">{t('materials.view_title')}</Typography>            <GeneralFilter onFilter={handleApplyFilters} />
            <MaterialTableMui
                materials={materials}
                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                loading={loading}
                onAddClick={handleAddClick}
                onEditClick={handleEditClick}
                onSelectionModelChange={handleSelectionChange}
                onDeleteSelected={handleDeleteSelected}
                selectedIds={{ type: "include", ids: selectedRowIds.ids }}
                stockMap={stockMap}
            />

            <MaterialDialogMui
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={(handleSaveMaterial)}
                initialValues={materialsToEdit}
            />
        </Box>
    );
}
