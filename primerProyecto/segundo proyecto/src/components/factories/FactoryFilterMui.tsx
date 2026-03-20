
import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";


export interface FactoryFilterValuesMui {
    codeOrNameLike: string;
    externalCode: string;
    description: string;
}

interface FactoryFilterPropsMui {
    onFilter: (values: FactoryFilterValuesMui) => void;
}

export const FactoryFilterMui = ({ onFilter }: FactoryFilterPropsMui) => {
    const [boolInvisible, setBoolInvisible] = useState(false);
    const [filters, setFilters] = useState<FactoryFilterValuesMui>({
        codeOrNameLike: "",
        externalCode: "",
        description: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleClearFilters = () => {
        const emptyFilters = {
            codeOrNameLike: "",
            externalCode: "",
            description: ""
        };
        setFilters(emptyFilters);
        onFilter(emptyFilters);
    }

    return (
        <Box sx={{ marginBottom: 2 }}>
            <Button variant="contained" onClick={() => setBoolInvisible(!boolInvisible)}
                sx={{
                    backgroundColor: " #298d29",
                    "&:hover": { backgroundColor: "#1b581b", color: "white", border: "1px solid black" }
                }}>
                {boolInvisible ? "Ocultar Filtro" : "Mostrar Filtro"}
            </Button>
            {/* Contenedor del formulario para el filtro */}
            <Box sx={{
                marginTop: 2,
                display: boolInvisible ? "block" : "none",
                border: "1px solid black",
                padding: 2,
                borderRadius: 1,
            }}>

                {/* Contenedor de los TextField */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2
                    }}
                >


                    <TextField
                        label="Código o Nombre"
                        name="codeOrNameLike"
                        value={filters.codeOrNameLike}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Código Externo"
                        name="externalCode"
                        value={filters.externalCode}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Descripción"
                        name="description"
                        value={filters.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Box>
                <br />
                <Box sx={{ marginTop: 2 }}>
                    <Button variant="contained" onClick={() => onFilter(filters)}
                        sx={{ marginRight: 1, backgroundColor: " #298d29", "&:hover": { backgroundColor: "#1b581b", color: "white", border: "1px solid black" } }}>
                        Aplicar Filtro
                    </Button>
                    <Button variant="outlined" onClick={handleClearFilters}
                        sx={{ marginRight: 1, backgroundColor: "white", borderColor: "#1b581b", "&:hover": { backgroundColor: "#1b581b", color: "white", borderColor: "black" } }}
                    >
                        Limpiar Filtro
                    </Button>
                </Box>
            </Box>
        </Box>
    );


}