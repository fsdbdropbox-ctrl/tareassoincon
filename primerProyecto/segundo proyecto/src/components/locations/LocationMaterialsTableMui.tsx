import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { LocationMaterial } from "../../types/locations";
import { SecureImage } from "../common/images/SecureImage";
import { useTranslation } from "react-i18next";

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

    const { t } = useTranslation();

    const columns: GridColDef[] = [
        {
            field: "imageUuid",
            headerName: t('common.image.col_header'),
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
        { field: "materialId", headerName: t('location_materials.columns.mat_id'), width: 120, align: "center", headerAlign: "center" },
        { field: "materialName", headerName: t('location_materials.columns.mat_name'), flex: 1, align: "center", headerAlign: "center" },
        { field: "externalCode", headerName: t('location_materials.columns.external_code_short'), flex: 1, align: "center", headerAlign: "center" },
        { field: "description", headerName: t('common.filters.description'), flex: 1, align: "center", headerAlign: "center" },
        { field: "measureUnitId", headerName: t('location_materials.columns.measure_unit_short'), flex: 1, align: "center", headerAlign: "center" },
        {
            field: "tipoMaterial",
            headerName: t('location_materials.columns.material_type'),
            width: 220,
            renderCell: (params) => {
                const tipos: string[] = [];
                if (params.row.isRawMaterial) tipos.push(t('materials.types_compact.raw'));
                if (params.row.isSemifinished) tipos.push(t('materials.types_compact.semi'));
                if (params.row.isFinished) tipos.push(t('materials.types_compact.finished'));
                if (params.row.isVirtual) tipos.push(t('materials.types_compact.virtual'));
                return tipos.length > 0 ? tipos.join(", ") : t('common.status.unassigned');
            }
        },
        { field: "observations", headerName: t('materials.columns.observations'), flex: 1, align: "center", headerAlign: "center" },

        { field: "unitsToPick", headerName: t('location_materials.columns.quantity'), flex: 1, align: "center", headerAlign: "center" },
        {
            field: "isDefault",
            headerName: t('location_materials.columns.is_default'),
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
                    {t('location_materials.add_button')}
                </Button>
                {selectedIds.ids.size > 0 && (
                    <Button variant="contained" color="error" onClick={onDeleteSelected}>
                        {t('location_materials.delete_button', { count: selectedIds.ids.size })}
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
                localeText={{
                    paginationRowsPerPage: t('common.table.rows_per_page'),
                    paginationDisplayedRows: ({ from, to, count }) => {
                        if (loading) return t('common.status.loading');
                        return `${from}–${to} ${t('common.table.of')} ${count !== -1 ? count : `${t('common.table.more_than')} ${to}`}`;
                    },
                }}
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
