import { Factory } from "../../../types/factory";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";

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
    loading
}: FactoryTableProps) => {

    const columns: GridColDef[] = [
        { field: "code", headerName: "Código", flex: 1, align: "center", headerAlign: "center" },
        { field: "name", headerName: "Nombre", flex: 1, align: "center", headerAlign: "center" },
        { field: "externalCode", headerName: "Código Externo", flex: 1, align: "center", headerAlign: "center" },
        { field: "description", headerName: "Descripción", flex: 1, align: "center", headerAlign: "center" }
    ];

    return (
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>

            <DataGrid
                rows={factories}
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