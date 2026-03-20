import { Outlet, useLocation, Link } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";

export const MainLayout = () => {
    const location = useLocation();

    const currentTab = location.pathname.startsWith("/locations") ? "/locations" : "/materials";
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: 2,
            }}
        >
            <Tabs value={currentTab}
                textColor="inherit"
                indicatorColor="secondary"
            >
                <Tab label="Materiales" value="/materials" component={Link} to="/materials" />
                <Tab label="Localizaciones" value="/locations" component={Link} to="/locations" />
            </Tabs>

            <Box sx={{
                p: 3,
                flexGrow: 1,
                backgroundColor: "background.paper",
            }}>
                <Outlet />
            </Box >
        </Box >
    )
}