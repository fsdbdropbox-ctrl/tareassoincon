import { useState, useEffect } from "react";
import { searchFactories, createFactory, updateFactory, deleteFactory } from "../api/factoryService";
import { Factory } from "../types/factory";
import { FactoryTableMui } from "../componentes/factories/conMui/FactoryTableMui";
import { FactoryFilterMui, FactoryFilterValuesMui } from "../componentes/factories/conMui/FactoryFilterMui";
import { Box } from "@mui/material";
import { GridSortModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { FactoryDialogMui } from "../componentes/factories/conMui/FactoryDialogMui";


export const Tarea2 = () => {

    // solo necesitamos un estado,
    //  ya que el back será quien decida qué fábricas
    //  mostrar según los filtros que le enviemos,
    // por lo que no necesitamos un estado para almacenar las fábricas
    //  sin filtrar
    const [factories, setFactories] = useState<Factory[]>([]);


    const [rowCount, setRowCount] = useState(0);

    // Guardamos los filtros actuales para poder
    //  usarlos en la paginación
    const [currentFilters, setCurrentFilters] = useState<FactoryFilterValuesMui>({
        codeOrNameLike: "",
        externalCode: "",
        description: ""
    });

    // Guardamos la paginación actual
    //  empezamos en el 0, ya que el backend espera la página 0 
    // como la primera página

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    });


    // estado para el sorting
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [loading, setLoading] = useState(false);

    // Estados para el CRUD
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);
    const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>(
        {
            type: "include",
            ids: new Set<any>(),
        }
    );

    const handleAddClick = () => {
        setSelectedFactory(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (factory: Factory) => {
        setSelectedFactory(factory);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedFactory(null);
    }

    const handleDeleteSelected = async () => {
        const confirmacion = window.confirm(`¿Seguro que quieres borrar ${selectedRowIds.ids.size} fábricas?`);
        if (!confirmacion) return;
        try {
            setLoading(true);
            await Promise.all(Array.from(selectedRowIds.ids).map(id => deleteFactory(1, Number(id))));

            alert("Fábricas borradas correctamente");

            await fetchFactories(currentFilters, paginationModel.page, paginationModel.pageSize, sortModel);
            setSelectedRowIds(
                {
                    type: "include",
                    ids: new Set<any>(),
                }
            );
        } catch (error) {
            console.error("Error deleting factories:", error);
        } finally {
            setLoading(false);
        }

    }

    const handleSaveFactory = async (formData: Partial<Factory>) => {
        try {
            setLoading(true);
            const clientId = 1;

            if (selectedFactory && selectedFactory.id) {
                const updatedFactory = { ...selectedFactory, ...formData };
                await updateFactory(clientId, selectedFactory.id, updatedFactory);
            } else {
                await createFactory(clientId, formData);
            }
            await fetchFactories(currentFilters, paginationModel.page, paginationModel.pageSize, sortModel);
            handleCloseDialog();
        } catch (error) {
            console.error("Error saving factory:", error);
            alert("Error al guardar la fábrica");
        }
        finally {
            setLoading(false);
        }
    }



    const fetchFactories = async (
        filters: FactoryFilterValuesMui,
        page: number,
        pageSize: number,
        sort: GridSortModel
    ) => {
        setLoading(true);
        try {
            const filteredFactories = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== "")
            );
            const results = await searchFactories(
                1,
                filteredFactories,
                page,
                pageSize,
                sort
            );
            setFactories(results.factories);
            setRowCount(results.total);
        } catch (error) {
            console.error("Error fetching factories:", error);
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        // hacemos una búsqueda inicial sin filtros para mostrar todas
        //  las fábricas
        fetchFactories(currentFilters, paginationModel.page, paginationModel.pageSize, sortModel);
    }, [currentFilters, paginationModel.page, paginationModel.pageSize, sortModel]);

    const handleFilter = (filters: FactoryFilterValuesMui) => {
        setCurrentFilters(filters);
        // al aplicar un filtro, reseteamos la paginación a la primera página
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }


    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                overflowX: "hidden",
                padding: 2,
            }}
        >
            <h1>Tarea 2 con post Search Factory</h1>
            <p>Tabla con Material UI y filtrado en el BackEnd en vez del Front</p>

            <FactoryFilterMui onFilter={handleFilter} />
            <FactoryTableMui
                factories={factories || []}
                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                loading={loading}

                // Manejadores para el CRUD
                onAddClick={handleAddClick}
                onEditClick={handleEditClick}
                onSelectionModelChange={(newSelection) => setSelectedRowIds(newSelection)}
                onDeleteSelected={handleDeleteSelected}
                selectedIds={selectedRowIds}
            />

            <FactoryDialogMui
                open={isDialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSaveFactory}
                factoryToEdit={selectedFactory}
            />
        </Box>
    );
}