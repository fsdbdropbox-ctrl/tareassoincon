import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { MasterLocation } from "../../types/MasterLocations";
import { SecureImage } from "../common/images/SecureImage";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
interface Props {
    data: MasterLocation[];
    loading?: boolean;
    onRowClick: (id: number) => void;
    rowCount: number;
    paginationModel: { page: number, pageSize: number };
    onPaginationModelChange: (model: { page: number, pageSize: number }) => void;
    selectedIds: GridRowSelectionModel;
    onSelectionChange: (selectedIds: GridRowSelectionModel) => void;
    onDeleteSelected: () => void;
    onEditSelected: (id: number) => void;

}

export const MasterLocationsTableMui = ({
    data,
    loading,
    onRowClick,
    rowCount,
    paginationModel,
    onPaginationModelChange,
    selectedIds,
    onSelectionChange,
    onDeleteSelected,
    onEditSelected
}: Props) => {
    const columns: GridColDef[] = [
        {
            field: "imageUuid",
            headerName: "Img",
            sortable: false,
            filterable: false,
            align: "center",
            renderCell: (params) => (
                <SecureImage
                    imageId={params.row.imageUuid}
                    alt={params.row.name}
                    width={40}
                    height={40}
                    clickable
                />
            )
        },
        { field: "code", headerName: "Código", width: 130 },
        { field: "name", headerName: "Nombre", flex: 1 },
        {
            field: "allowStorage",
            headerName: "Permite Almacenar",
            width: 150,
            align: "center",
            renderCell: (params) => (
                params.value ? (
                    <CheckBoxIcon color="primary" />
                ) : (
                    <CheckBoxOutlineBlankIcon color="action" />
                )
            ),
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
            align: "center",
            renderCell: (params) => (
                params.value ? (
                    <CheckBoxIcon color="primary" />
                ) : (
                    <CheckBoxOutlineBlankIcon color="action" />
                )
            ),

        }
    ];
    const selectedCount = selectedIds?.ids?.size || 0;

    return (
        <Box sx={{ height: 500, width: "100%", mt: 2 }}>
            <Box sx={{ mb: 1, display: "flex", gap: 1, minHeight: "36px" }}>

                {selectedCount === 1 && (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            const singleId = Array.from(selectedIds.ids)[0];
                            onEditSelected(Number(singleId));
                        }}
                    >
                        Editar Seleccionado
                    </Button>
                )}

                {selectedCount > 0 && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onDeleteSelected}
                    >
                        - Eliminar ({selectedCount})
                    </Button>
                )}
            </Box>
            <DataGrid
                rows={data}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick

                checkboxSelection
                rowSelectionModel={selectedIds}
                onRowSelectionModelChange={onSelectionChange}

                onRowClick={(params) => onRowClick(params.row.id as number)}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                paginationMode="server"
                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}

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