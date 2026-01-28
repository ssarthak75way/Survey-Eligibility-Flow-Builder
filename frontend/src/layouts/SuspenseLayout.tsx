import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { createStyle } from "../theme/muiThemes";

export function LoadingFallback() {
    return (
        <Box sx={{ ...createStyle.loadingFallBack }}>
            <CircularProgress />
        </Box>
    );
}

export default function SuspenseLayout() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Outlet />
        </Suspense>
    );
}
