import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface GeneralFilterValues {
    code: string,
    name: string,
    externalCode: string,
    description: string,
}

interface GeneralFilterProps {
    onFilter: (value: GeneralFilterValues) => void;
}

export const GeneralFilter = ({ onFilter }: GeneralFilterProps) => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<GeneralFilterValues>({
        code: "",
        name: "",
        externalCode: "",
        description: "",
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
            code: "",
            name: "",
            externalCode: "",
            description: "",
        };
        setFilters(emptyFilters);
        onFilter(emptyFilters);
    }


    return (
        <Box sx={{
            marginBottom: 2,
            marginTop: 2,
            border: "1px solid #ccc",
            padding: 2,
            borderRadius: 1,
            backgroundColor: "#fcfcfc"
        }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2
                }}
            >
                <TextField
                    label={t('common.filters.code')}
                    name="code"
                    value={filters.code}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                />
                <TextField
                    label={t('common.filters.name')}
                    name="name"
                    value={filters.name}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                /><TextField
                    label={t('common.filters.externalCode')}
                    name="externalCode"
                    value={filters.externalCode}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                /><TextField
                    label={t('common.filters.description')}
                    name="description"
                    value={filters.description}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                />
            </Box>
            <Box sx={{ marginTop: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button variant="outlined" onClick={handleClearFilters}
                    sx={{
                        backgroundColor: "white",
                        borderColor: "#1b581b",
                        color: "#1b581b",
                        "&:hover": { backgroundColor: "#f0f0f0", borderColor: "black" }
                    }}
                >{t('common.buttons.clear')}</Button>
                <Button variant="contained" onClick={() => onFilter(filters)}
                    sx={{
                        backgroundColor: "#298d29",
                        "&:hover": { backgroundColor: "#1b581b", color: "white" }
                    }}
                >{t('common.buttons.search')}</Button>
            </Box>

        </Box>
    )
}