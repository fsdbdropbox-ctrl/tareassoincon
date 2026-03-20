import { Factory } from "../../../types/factory";
import { DataGrid, GridColDef, GridSortModel, GridRowSelectionModel, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useState } from "react";

// volvemos a recoger la interfaz Factory
// con los datos que necesitamos
interface FactoryTableProps {
    factories: Factory[];
    // props para la paginación
    rowCount: number;
    paginationModel: {
        page: number;
        pageSize: number;
    };
    onPaginationModelChange: (model: { page: number; pageSize: number }) => void;

    // props para el sorting
    sortModel: GridSortModel;
    onSortModelChange: (model: GridSortModel) => void;
    loading?: boolean;

    // props para el crud
    onAddClick: () => void;
    onEditClick: (factory: Factory) => void;
    onSelectionModelChange: (selectedIds: GridRowSelectionModel) => void;
    onDeleteSelected: () => void;
    selectedIds: GridRowSelectionModel;
}

// definimos el componente FactoryTable,
//  que recibe un array de fábricas como prop
export const FactoryTableMui = ({
    factories,
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
}: FactoryTableProps) => {

    // definimos las columnas de la tabla, con sus campos y encabezados
    const columns: GridColDef[] = [
        { field: "code", headerName: "Código", flex: 1, align: "center", headerAlign: "center" },
        { field: "name", headerName: "Nombre", flex: 1, align: "center", headerAlign: "center" },
        { field: "externalCode", headerName: "Código Externo", flex: 1, align: "center", headerAlign: "center" },
        { field: "description", headerName: "Descripción", flex: 1, align: "center", headerAlign: "center" }
    ];




    const CustomToolbar = () => {
        return (
            <Box sx={{ display: "flex", justifyContent: "space-between", backgroundColor: "#8c633d", p: 1, borderTopLeftRadius: "4px", borderTopRightRadius: "4px", border: "1px solid black", borderBottom: "none" }}>
                <Button
                    onClick={onAddClick}
                    variant="contained"
                    sx={{ backgroundColor: "#298d29", color: "white", fontWeight: "bold", "&:hover": { backgroundColor: "#1e6b1e" } }}
                >
                    + Agregar Almacén
                </Button>

                {/* Solo mostramos el botón de borrar si hay casillas seleccionadas */}
                {(selectedIds && selectedIds.ids.size > 0) ? (
                    <Button
                        onClick={onDeleteSelected}
                        variant="contained"
                        sx={{ backgroundColor: "#c0392b", color: "white", fontWeight: "bold", "&:hover": { backgroundColor: "#a93226" } }}
                    >
                        - Borrar Seleccionados ({selectedIds.ids.size})
                    </Button>
                ) : <div></div>}
            </Box>
        );
    }

    const [toolbarVisible, setToolbarVisible] = useState(false);

    const handleToggleToolbar = () => {
        setToolbarVisible((prev) => !prev);
    }

    return (
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>

            <Box sx={{ marginBottom: 1, display: "flex", justifyContent: "flex-start" }}>
                <Button
                    variant="contained"
                    onClick={handleToggleToolbar}
                    sx={{
                        backgroundColor: toolbarVisible ? "#c0392b" : "#298d29",
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": {
                            backgroundColor: toolbarVisible ? "#a93226" : "#1e6b1e"
                        }
                    }}
                >
                    {toolbarVisible ? "-" : "+"}
                </Button>

            </Box>


            <DataGrid

                showToolbar={toolbarVisible}
                // toolbar personalizado

                slots={{
                    toolbar: CustomToolbar
                }}


                rows={factories || []}
                getRowId={(row) => row?.id || row?.code}

                columns={columns}

                // paginacion en el server
                paginationMode="server"
                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                pageSizeOptions={[5, 10, 25]}

                // sorting en el server
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={onSortModelChange}
                loading={loading}

                disableRowSelectionOnClick

                showCellVerticalBorder
                showColumnVerticalBorder

                // editar al hacer dobleClick
                onRowDoubleClick={(params) => onEditClick(params.row)}

                // checkboxes para seleccionar las que vamos a borrar
                checkboxSelection
                onRowSelectionModelChange={(newSelection) => onSelectionModelChange(newSelection)}
                rowSelectionModel={selectedIds}




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
                }
                }
            />
        </div>

    );
}