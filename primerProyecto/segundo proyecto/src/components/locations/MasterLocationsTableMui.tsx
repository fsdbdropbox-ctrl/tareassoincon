import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { MasterLocation } from "../../types/MasterLocations";

interface Props {
    data: MasterLocation[];
    loading?: boolean;
    onRowClick: (id: number) => void;
}

export const MasterLocationsTableMui = ({ data, loading, onRowClick }: Props) => {
    const columns: GridColDef[] = [
        { field: "code", headerName: "Código", width: 130 },
        { field: "name", headerName: "Nombre", flex: 1 },
        {
            field: "allowStorage",
            headerName: "Permite Almacenar",
            width: 150,
            type: "boolean",
            align: "center"
        },
        {
            field: "allowOtherMaterials",
            headerName: "Gestión",
            width: 150,
            align: "center",

            renderCell: (params) => params.row.allowOtherMaterials ? "Caótica" : "Ordenada"
        },
        {
            field: "allowMaterialRequests",
            headerName: "Permite Solicitudes",
            width: 160,
            type: "boolean",
            align: "center"
        }
    ];

    return (
        <Box sx={{ height: 500, width: "100%", mt: 2 }}>
            <DataGrid
                rows={data}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                onRowClick={(params) => onRowClick(params.row.id as number)}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                sx={{
                    border: "1px solid black",
                    cursor: "pointer",
                    "& .MuiDataGrid-row:hover": { backgroundColor: "#f5f5f5" },
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#3f51b5",
                        color: "white",
                    }
                }}
            />
        </Box>
    );
};