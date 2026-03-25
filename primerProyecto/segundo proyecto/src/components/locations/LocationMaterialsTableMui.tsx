import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { LocationMaterial } from "../../types/locations";
import { SecureImage } from "../common/images/SecureImage";

interface Props {
    data: LocationMaterial[];
    loading?: boolean;
    onAddClick: () => void;
    onEditClick: (item: LocationMaterial) => void;
    onSelectionChange: (selectedIds: GridRowSelectionModel) => void;
    onDeleteSelected: () => void;
    selectedIds: GridRowSelectionModel;
}


export const LocationMaterialsTableMui = ({ data, loading, onAddClick, onEditClick, onSelectionChange, onDeleteSelected, selectedIds }: Props) => {

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
                />
            )
        },
        { field: "materialId", headerName: "Id del Material", width: 120, align: "center", headerAlign: "center" },
        { field: "materialName", headerName: "Nombre del Material", flex: 1, align: "center", headerAlign: "center" },
        { field: "externalCode", headerName: "Cód. Externo", flex: 1, align: "center", headerAlign: "center" },
        { field: "description", headerName: "Descripción", flex: 1, align: "center", headerAlign: "center" },
        { field: "measureUnitId", headerName: "U. Medida", flex: 1, align: "center", headerAlign: "center" },
        {
            field: "tipoMaterial",
            headerName: "Tipo de material",
            width: 220,
            renderCell: (params) => {
                const tipos = [];
                if (params.row.isRawMaterial) tipos.push("Materia Prima");
                if (params.row.isSemiFinished) tipos.push("Semielaborado");
                if (params.row.isFinished) tipos.push("Terminado");
                if (params.row.isVirtual) tipos.push("Virtual");
                return tipos.length > 0 ? tipos.join(", ") : "Sin asignar"
            }
        },
        { field: "observations", headerName: "Observaciones", flex: 1, align: "center", headerAlign: "center" },

        { field: "unitsToPick", headerName: "Cantidad", flex: 1, align: "center", headerAlign: "center" },
        {
            field: "isDefault",
            headerName: "Ubicación Principal?",
            flex: 1,
            align: "center",
            headerAlign: "center",
            type: "boolean"
        }

    ];

    return (
        <Box sx={{ height: 400, width: "100%", mt: 2 }}>
            <Box sx={{ mb: 1, display: "flex", gap: 1 }}>
                <Button variant="contained" color="success" onClick={onAddClick}>
                    + Añadir Material a Localización
                </Button>
                {selectedIds.ids.size > 0 && (
                    <Button variant="contained" color="error" onClick={onDeleteSelected}>
                        - Eliminar Materiales seleccionados ({selectedIds.ids.size})
                    </Button>
                )}
            </Box>
            <DataGrid
                rows={data}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                checkboxSelection
                onRowSelectionModelChange={onSelectionChange}
                rowSelectionModel={selectedIds}
                onRowDoubleClick={(params) => onEditClick(params.row)}

                initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                sx={{
                    border: "1px solid black",
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#8c633d",
                        color: "white",
                    }
                }}

            />
        </Box>

    );
}