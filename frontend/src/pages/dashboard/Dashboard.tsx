import { useEffect, useState } from 'react';
import {
    Typography,
    Grid,
    Button,
    Box,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Fab,
} from '@mui/material';
import {
    Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setSurveys, addSurvey, removeSurvey, setLoading } from '../../store/slices/surveySlice';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '../../context/useToast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { SurveyCard } from '../../components/common/SurveyCard';
// ---------------- styles ----------------

const emptyStateStyles = {
    textAlign: "center",
    py: 10,
    bgcolor: "rgba(255,255,255,0.02)",
    borderRadius: 4,
    border: "2px dashed rgba(255,255,255,0.05)",
};



const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { surveys, loading } = useSelector((state: RootState) => state.survey);
    const { showToast } = useToast();

    const [openNewDialog, setOpenNewDialog] = useState(false);
    const [newSurveyData, setNewSurveyData] = useState({ title: '', description: '' });
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
    const [error, setError] = useState(" ");
    // const [exportPage, setExportPage] = useState(1);
    const exportPage = 1;
    // const fetchSurveys = async () => {
    //     dispatch(setLoading(true));
    //     try {
    //         const response = await axiosInstance.get('/surveys');
    //         dispatch(setSurveys(response.data));
    //     } catch (error) {
    //         console.error('Error fetching surveys:', error);
    //     } finally {
    //         dispatch(setLoading(false));
    //     }
    // };

    useEffect(() => {
        const fetchSurveys = async () => {
            dispatch(setLoading(true));
            try {
                const response = await axiosInstance.get("/api/surveys");
                dispatch(setSurveys(response.data));
            } catch (error) {
                console.error("Error fetching surveys:", error);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchSurveys();
    }, [dispatch]);

    const handleCreateSurvey = async () => {
        try {
            const response = await axiosInstance.post('/api/surveys', newSurveyData);
            dispatch(addSurvey(response.data));
            setOpenNewDialog(false);
            showToast('Survey created successfully', 'success');
            navigate(`/builder/${response.data._id}`);
        } catch (err: unknown) {
            showToast('Failed to create survey', 'error');
            setError(getErrorMessage(err))
            console.error(error);



        }
    };

    const handleDeleteSurvey = async () => {
        const { id } = confirmDelete;
        try {
            await axiosInstance.delete(`/api/surveys/${id}`);
            dispatch(removeSurvey(id));
            showToast('Survey deleted', 'info');
        } catch (err: unknown) {
            showToast('Failed to delete survey', 'error');
            setError(getErrorMessage(err))
            console.error(error);
        } finally {
            setConfirmDelete({ open: false, id: '' });
        }
    };

    const handleExportResults = (surveyName: string) => {
        // Mock results with pagination logic
        const results = Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            user: `User ${i + 1}`,
            status: i % 3 === 0 ? 'Eligible' : 'Ineligible',
            timestamp: new Date().toISOString()
        }));

        const pageSize = 10;
        const paginatedResults = results.slice((exportPage - 1) * pageSize, exportPage * pageSize);

        const csv = 'ID,User,Status,Timestamp\n' +
            paginatedResults.map(r => `${r.id},${r.user},${r.status},${r.timestamp}`).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${surveyName}-results-page-${exportPage}.csv`;
        link.click();
        showToast(`Exported page ${exportPage} of results`, 'success');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        Your Surveys
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage and monitor your eligibility flows
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenNewDialog(true)}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                    New Survey
                </Button>
            </Box>

            {loading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3].map((i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : surveys.length === 0 ? (
                <Box sx={emptyStateStyles}>

                    <Typography variant="h6" gutterBottom>
                        No surveys yet
                    </Typography>
                    <Button variant="outlined" onClick={() => setOpenNewDialog(true)}>
                        Create your first survey
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {surveys.map((survey) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={survey._id}>
                            <SurveyCard
                                survey={survey}
                                onEdit={() => navigate(`/builder/${survey._id}`)}
                                onExport={() => handleExportResults(survey.title)}
                                onDelete={() =>
                                    setConfirmDelete({ open: true, id: survey._id })
                                }
                            />
                        </Grid>
                    ))}
                </Grid>

            )}

            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 32, right: 32, display: { sm: 'none' } }}
                onClick={() => setOpenNewDialog(true)}
            >
                <AddIcon />
            </Fab>

            {/* New Survey Dialog */}
            <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Create New Survey</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Survey Title"
                        margin="normal"
                        value={newSurveyData.title}
                        onChange={(e) => setNewSurveyData({ ...newSurveyData, title: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        multiline
                        rows={3}
                        value={newSurveyData.description}
                        onChange={(e) => setNewSurveyData({ ...newSurveyData, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenNewDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateSurvey}
                        disabled={!newSurveyData.title}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={confirmDelete.open}
                title="Delete Survey"
                message="Are you sure you want to delete this survey? This action cannot be undone."
                onConfirm={handleDeleteSurvey}
                onCancel={() => setConfirmDelete({ open: false, id: '' })}
            />
        </Box>
    );
};

export default Dashboard;
