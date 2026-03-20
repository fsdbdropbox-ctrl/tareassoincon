import { Material } from "../../types/materials";
import { DataGrid, GridColDef, GridSortModel, GridRowSelectionModel, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useState } from "react";

interface MaterialTableProps {
    materials: Material[];
    rowCount: number;
    paginationModel: {
        page: number;
        pageSize: number;
    };
    onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
    sortModel: GridSortModel;
    onSortModelChange: (model: GridSortModel) => void;
    loading?: boolean;
    onAddClick: () => void;
    onEditClick: (material: Material) => void;
    onSelectionModelChange: (selectedIds: GridRowSelectionModel) => void;
    onDeleteSelected: () => void;
    selectedIds: GridRowSelectionModel;
}

export const MaterialTableMui = ({
    materials,
    rowCount,
    paginationModel,
    onPaginationModelChange,
    sortModel,
    onSortModelChange,
    loading,
    onAddClick,
    onEditClick,
    onSelectionModelChange,
    onDeleteSelected,
    selectedIds
}: MaterialTableProps) => {
    const columns: GridColDef[] = [
        { field: "code", headerName: "Código", flex: 1, align: "center", headerAlign: "center" },
        { field: "name", headerName: "Nombre", flex: 1, align: "center", headerAlign: "center" },
        { field: "externalCode", headerName: "Código Externo", flex: 1, align: "center", headerAlign: "center" },
        { field: "description", headerName: "Descripción", flex: 1, align: "center", headerAlign: "center" },
        { field: "measureUnitId", headerName: "Unidad de Medida", flex: 1, align: "center", headerAlign: "center" },
        {
            field: "materialType",
            headerName: "Tipo de Material",
            flex: 1,
            align: "center",
            headerAlign: "center",
            valueGetter: (params, row) => {
                if (row.isRawMaterial) return "Materia Prima";
                if (row.isSemifinished) return "Semielaborado";
                if (row.isFinished) return "Producto Terminado";
                return "Otro";
            }
        },
        { field: "observations", headerName: "Observaciones", flex: 1, align: "center", headerAlign: "center" }
    ];

    const [toolbarVisible, setToolbarVisible] = useState(false);
    const handleToggleToolbar = () => {
        setToolbarVisible((prev) => !prev);
    }

    return (
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
            <Box sx={{ marginBottom: 1, display: "flex", justifyContent: "flex-start", gap: 1 }}>
                {/* Los botones de acción solo aparecen si la toolbar está visible */}
                {toolbarVisible && (
                    <>
                        <Button
                            variant="contained"
                            onClick={onAddClick}
                            sx={{ backgroundColor: "#298d29", color: "white", fontWeight: "bold", "&:hover": { backgroundColor: "#1e6b1e" } }}
                        >
                            + Agregar Material
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onDeleteSelected}
                            sx={{ backgroundColor: "#c0392b", color: "white", fontWeight: "bold", "&:hover": { backgroundColor: "#a93226" } }}
                        >
                            - Borrar Seleccionados ({selectedIds.ids.size})
                        </Button>
                    </>
                )}

                {/* El botón de toggle siempre está visible */}
                <Button
                    variant="contained"
                    onClick={handleToggleToolbar}
                    sx={{ backgroundColor: toolbarVisible ? "#c0392b" : "#298d29", color: "white", fontWeight: "bold", "&:hover": { backgroundColor: toolbarVisible ? "#a93226" : "#1e6b1e" } }}
                >
                    {toolbarVisible ? "-" : "+"}
                </Button>
            </Box>
            <DataGrid
                rows={materials}
                columns={columns}
                pageSizeOptions={[5, 10, 25]}
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                paginationMode="server"
                rowCount={rowCount}

                getRowId={(row) => row?.id || row?.code}

                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={onSortModelChange}
                loading={loading}

                disableRowSelectionOnClick
                showCellVerticalBorder
                showColumnVerticalBorder

                onRowDoubleClick={(params) => onEditClick(params.row)}

                checkboxSelection
                onRowSelectionModelChange={(newSelection) => onSelectionModelChange(newSelection)}
                rowSelectionModel={selectedIds}

                localeText={{
                    paginationDisplayedRows: ({ from, to, count }) => {
                        if (loading) return "Cargando...";
                        return `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`;
                    }
                }}

                sx={{
                    border: "1px solid black",
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#8c633d",
                        borderColor: "black",
                        color: "white",
                    },
                    "& .MuiDataGrid-cell": {
                        borderColor: "black",
                    }
                }}
            />
        </div>
    )

}