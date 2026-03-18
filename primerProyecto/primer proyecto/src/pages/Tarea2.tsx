import { useState, useEffect } from "react";
import { searchFactories } from "../api/factoryService";
import { Factory } from "../types/factory";
import { FactoryTableMui } from "../componentes/factories/conMui/FactoryTableMui";
import { FactoryFilterMui, FactoryFilterValuesMui } from "../componentes/factories/conMui/FactoryFilterMui";
import { Box } from "@mui/material";
import { GridSortModel } from "@mui/x-data-grid";

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

    const fetchFactories = async (
        filters: FactoryFilterValuesMui,
        page: number,
        pageSize: number,
        sort: GridSortModel
    ) => {
        setLoading(true);
        try {
            const filteredFactories = Object.fromEntries(
                Object.entries(filters).filter(([key, value]) => value !== "")
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
    }, [paginationModel.page, paginationModel.pageSize, sortModel]);

    const handleFilter = async (filters: FactoryFilterValuesMui) => {
        setCurrentFilters(filters);
        // al aplicar un filtro, reseteamos la paginación a la primera página
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        fetchFactories(filters, 0, paginationModel.pageSize, sortModel);

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

            />
        </Box>
    );
}