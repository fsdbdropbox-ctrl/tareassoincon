import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMasterLocations } from "../api/locationService";
import { MasterLocation } from "../types/MasterLocations";
import { MasterLocationsTableMui } from "../components/locations/MasterLocationsTableMui";
import { preloadImagesIntoCache } from "../api/documentService";

export const LocationView = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState<MasterLocation[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMasterData = async () => {
            setLoading(true);
            try {
                const data = await getMasterLocations();
                setLocations(data);

                const uuidsToFetch = data.map((loc) => loc.imageUuid);

                preloadImagesIntoCache(uuidsToFetch);
            } catch (error) {
                console.error("Error cargando localizaciones maestras:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMasterData();
    }, []);

    const handleRowClick = (id: number) => {
        navigate(`/locations/${id}/materials`); // Nos manda a la vista detalle
    };

    return (
        <Box sx={{ width: "100%", height: "100%" }}>
            <Typography variant="h4">Localizaciones</Typography>
            <MasterLocationsTableMui
                data={locations}
                loading={loading}
                onRowClick={handleRowClick}
            />
        </Box>
    );
};