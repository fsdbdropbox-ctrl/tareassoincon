import { useState, useEffect, useCallback } from "react";
import { GridSortModel, GridRowSelectionModel, GridRowId } from "@mui/x-data-grid";
import { Material, MaterialFilter } from "../types/materials";
import { searchMaterials, deleteMaterial, updateMaterial, createMaterial } from "../api/materialService";
import { MaterialTableMui } from "../components/materials/MaterialTableMui";
import { Box, Typography } from "@mui/material";
import { MaterialDialogMui } from "../components/materials/MaterialsDialogMui";

export const MaterialsView = () => {

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

    const currentFilters: MaterialFilter = {}

    const fetchMaterialsData = useCallback(async () => {
        setLoading(true);
        try {
            const { materials, total } = await searchMaterials(
                currentFilters,
                paginationModel.page,
                paginationModel.pageSize,
                sortModel
            );
            setMaterials(materials);
            setRowCount(total);
        } catch (error) {
            console.error("Error al cargar los materiales:", error);
        } finally {
            setLoading(false);
        }
    }, [paginationModel.page, paginationModel.pageSize, sortModel]);

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
        const confirmacion = window.confirm(`¿Seguro que quieres borrar ${selectedRowIds.ids.size} materiales?`);
        if (!confirmacion) return;

        setLoading(true);
        try {
            // Convertimos el Set a un Array para poder iterar y borrar
            const idsArray = Array.from(selectedRowIds.ids);
            await Promise.all(idsArray.map(id => deleteMaterial(Number(id))));

            alert("Materiales borrados correctamente");
            setSelectedRowIds({ ids: new Set() }); // Limpiar selección
            fetchMaterialsData(); // Recargar la tabla
        } catch (error) {
            console.error("Error al borrar:", error);
            alert("Error al borrar. Es posible que el material esté en uso o haya un problema de base de datos.");
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
            alert("Material guardado correctamente")
            fetchMaterialsData();


        } catch (error) {
            console.error("Error al guardar el material:", error);
            alert("Hubo un error al guardar el material.");
        } finally { setLoading(false); }

    }

    return (
        <Box sx={{ width: "100%", height: "100%" }}>
            <Typography variant="h4">Materiales</Typography>
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
