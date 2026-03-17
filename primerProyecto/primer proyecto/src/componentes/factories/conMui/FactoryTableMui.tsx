import { Factory } from "../../../types/factory";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// volvemos a recoger la interfaz Factory
// con los datos que necesitamos
interface FactoryTableProps {
    factories: Factory[];
}

// definimos el componente FactoryTable,
//  que recibe un array de fábricas como prop
export const FactoryTableMui = ({ factories }: FactoryTableProps) => {

    const columns: GridColDef[] = [
        { field: "code", headerName: "Código", width: 150 },
        { field: "name", headerName: "Nombre", width: 150 },
        { field: "externalCode", headerName: "Código Externo", width: 150 },
        { field: "description", headerName: "Descripción", width: 200 }
    ];

    return (
        <div>

            <DataGrid style={{ height: 400, width: "100%", marginTop: "20px" }}
                rows={factories}
                columns={columns}
                pageSizeOptions={[5]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5 } }
                }}

                disableRowSelectionOnClick
            />
        </div>

    );
}