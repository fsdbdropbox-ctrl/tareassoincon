import { Outlet, useLocation, Link } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export const MainLayout = () => {
    const { t } = useTranslation();
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
                <Tab
                    label={t('materials.view_title')}
                    value="/materials"
                    component={Link}
                    to="/materials"
                />
                <Tab
                    label={t('locations.view_title')}
                    value="/locations"
                    component={Link}
                    to="/locations"
                />
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