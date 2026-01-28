import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                px: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 4, sm: 6 },
                    maxWidth: 420,
                    width: "100%",
                    textAlign: "center",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.08)",
                    bgcolor: "rgba(255,255,255,0.02)",
                }}
            >
                <Typography
                    sx={{
                        fontSize: { xs: "4rem", sm: "5rem" },
                        fontWeight: 900,
                        lineHeight: 1,
                        color: "primary.main",
                    }}
                >
                    404
                </Typography>

                <Typography variant="h6" sx={{ mt: 1, mb: 2, fontWeight: 600 }}>
                    Page not found
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    The page you’re looking for doesn’t exist or was moved.
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="outlined"
                        color="inherit"
                        sx={{ borderRadius: 999, px: 3 }}
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>

                    <Button
                        variant="contained"
                        sx={{ borderRadius: 999, px: 3 }}
                        onClick={() => navigate("/")}
                    >
                        Home
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
