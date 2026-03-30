import { Material } from "../../types/materials";
import { DataGrid, GridColDef, GridSortModel, GridRowSelectionModel, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { SecureImage } from "../common/images/SecureImage";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";



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
    stockMap: Record<number, number>;

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
    selectedIds,
    stockMap
}: MaterialTableProps) => {
    const { t } = useTranslation();
    const columns: GridColDef[] = [
        {
            field: "imageUuid",
            headerName: t('common.image.col_header'),
            width: 70,
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
        { field: "code", headerName: t('common.filters.code'), flex: 1, align: "center", headerAlign: "center" },
        { field: "name", headerName: t('common.filters.name'), flex: 1, align: "center", headerAlign: "center" },
        { field: "externalCode", headerName: t('common.filters.externalCode'), flex: 1, align: "center", headerAlign: "center" },
        { field: "description", headerName: t('common.filters.description'), flex: 1, align: "center", headerAlign: "center" },
        { field: "measureUnitId", headerName: t('materials.columns.measure_unit'), flex: 1, align: "center", headerAlign: "center" },
        {
            field: "materialType",
            headerName: t('materials.columns.type'),
            flex: 1,
            align: "center",
            headerAlign: "center",
            valueGetter: (params, row) => {
                if (row.isRawMaterial) return t('materials.types.raw');
                if (row.isSemifinished) return t('materials.types.semi');
                if (row.isFinished) return t('materials.types.finished');
                return t('materials.types.other');
            }
        },
        { field: "observations", headerName: t('materials.columns.observations'), flex: 1, align: "center", headerAlign: "center" },
        {
            field: "stock",
            headerName: t('materials.columns.stock'),
            flex: 1,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => {
                const liveStock = stockMap[params.row.id];
                const displayStock = liveStock !== undefined ? liveStock : 0;
                return (
                    <Box sx={{
                        fontWeight: 'bold',
                        color: displayStock > 0 ? '#298d29' : '#c0392b' // Verde si hay, rojo si es 0
                    }}>
                        {displayStock}

                    </Box>
                )
            }

        }
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
                            {t('materials.add_button')}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onDeleteSelected}
                            sx={{ backgroundColor: "#c0392b", color: "white", fontWeight: "bold", "&:hover": { backgroundColor: "#a93226" } }}
                        >
                            {t('common.buttons.delete_selected', { count: selectedIds.ids.size })}
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


                    paginationRowsPerPage: t('common.table.rows_per_page'),

                    paginationDisplayedRows: ({ from, to, count }) => {
                        if (loading) return t('common.status.loading');
                        return `${from}–${to} ${t('common.table.of')} ${count !== -1 ? count : `${t('common.table.more_than')} ${to}`}`;
                    },

                    footerRowSelected: (count) => t('common.buttons.delete_selected', { count })
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