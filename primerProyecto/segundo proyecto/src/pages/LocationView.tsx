import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { searchMasterLocations, deleteLocation, updateLocation, createLocation } from "../api/locationService";
import { MasterLocation } from "../types/MasterLocations";
import { MasterLocationsTableMui } from "../components/locations/MasterLocationsTableMui";
import { preloadImagesIntoCache } from "../api/documentService";
import { GeneralFilter, GeneralFilterValues } from "../components/common/filters/GeneralFilter";
import { GridRowSelectionModel, GridRowId } from "@mui/x-data-grid";
import { LocationDialogMui } from "../components/locations/LocationDialogMui";


export const LocationView = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState<MasterLocation[]>([]);
    const [loading, setLoading] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [locationToEdit, setLocationToEdit] = useState<MasterLocation | null>(null);

    const handleAddClick = () => {
        setLocationToEdit(null);
        setIsDialogOpen(true);
    }


    const handleEditSelected = (id: number) => {
        const locationFound = locations.find(loc => loc.id === id);
        if (locationFound) {
            setLocationToEdit(locationFound);
            setIsDialogOpen(true);
        }
    };

    const handleSaveLocation = async (values: Partial<MasterLocation>) => {
        setLoading(true);
        try {
            if (locationToEdit && locationToEdit.id) {
                const payloadToUpdate = {
                    ...locationToEdit,
                    ...values
                };
                await updateLocation(locationToEdit.id, payloadToUpdate);
                alert("Localización actualizada correctamente");

            } else {

                await createLocation(values);
                alert("Localización creada correctamente");
            }
            setIsDialogOpen(false);
            fetchMasterData();
        } catch (error) {
            console.error("Error guardando localización:", error);
            alert("Hubo un error al crear la localización. Revisa los datos.");
        } finally {
            setLoading(false);
        }
    };

    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    });

    const [currentFilters, setCurrentFilters] = useState<GeneralFilterValues>({
        code: "",
        name: "",
        externalCode: "",
        description: "",
    })

    const [selectedRowIds, setSelectedRowIds] = useState<{ ids: Set<GridRowId> }>({
        ids: new Set<GridRowId>()
    });


    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
        setSelectedRowIds({ ids: new Set((newSelection as any).ids) });
    };

    const handleDeleteSelected = async () => {
        const confirmacion = window.confirm(`Seguro que quieres eliminar ${selectedRowIds.ids.size} localizaciones?`)
        if (!confirmacion) {
            return;
        }
        setLoading(true);
        try {
            await Promise.all(Array.from(selectedRowIds.ids).map(id => deleteLocation(Number(id))));
            alert("Localizaciones borradas correctamente")
            setSelectedRowIds({ ids: new Set<GridRowId>() })
            fetchMasterData();
        } catch (error) {
            console.error("Error al borrar", error);
            alert("Error al borrar")
        } finally {
            setLoading(false);
        }
    }

    const handleApplyFilters = (values: GeneralFilterValues) => {
        setCurrentFilters(values);
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }


    const fetchMasterData = useCallback(async () => {
        setLoading(true);
        try {

            const { locations: data, total } = await searchMasterLocations(
                paginationModel.page,
                paginationModel.pageSize,
                currentFilters
            );


            const uuidsToFetch = data
                .map((item) => item.imageUuid)
                .filter((uuid) => uuid && uuid.trim() !== "");

            if (uuidsToFetch.length > 0) {
                preloadImagesIntoCache(uuidsToFetch);
            }
            setLocations(data);
            setRowCount(total);

        } catch (error) {
            console.error("Error cargando localizaciones maestras:", error);
        } finally {
            setLoading(false);
        }
    }, [paginationModel.page, paginationModel.pageSize, currentFilters]);
    useEffect(() => {
        fetchMasterData();
    }, [fetchMasterData]);


    const handleRowClick = (id: number) => {
        navigate(`/locations/${id}/materials`);
    };

    return (
        <Box sx={{ width: "100%", height: "100%" }}>
            <Typography variant="h4">Localizaciones</Typography>
            <Button variant="contained" color="primary" onClick={handleAddClick} sx={{ mb: 2, mt: 1 }}>
                + Nueva Localización
            </Button>
            <GeneralFilter onFilter={handleApplyFilters} />
            <MasterLocationsTableMui
                data={locations}
                loading={loading}
                onRowClick={handleRowClick}

                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}

                selectedIds={{ type: "include", ids: selectedRowIds.ids }}
                onSelectionChange={handleSelectionChange}
                onDeleteSelected={handleDeleteSelected}
                onEditSelected={handleEditSelected}
            />

            <LocationDialogMui
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSaveLocation}
                locationToEdit={locationToEdit}
            />
        </Box>
    );
};