import React, { useState, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Box, Paper, Typography, Breadcrumbs, Link, Skeleton, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/builder/Sidebar';
import FlowEditor from '../../components/builder/FlowEditor';
import axiosInstance from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSurvey, setLoading } from '../../store/slices/surveySlice';
import { RootState } from '../../store';
import { Download as DownloadIcon, Publish as PublishIcon } from '@mui/icons-material';
import { useToast } from '../../context/useToast';

const Builder = () => {
    const {showToast} = useToast();
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentSurvey, loading } = useSelector((state: RootState) => state.survey);

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const fetchSurvey = async () => {
        if (!id) return;
        dispatch(setLoading(true));
        try {
            const response = await axiosInstance.get(`/api/surveys/${id}`);
            dispatch(setCurrentSurvey(response.data));
            setNodes(response.data.nodes || []);
            setEdges(response.data.edges || []);
        } catch (error) {
            console.error('Error fetching survey:', error);
            navigate('/dashboard');
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchSurvey();
    }, [id]);

    const handleSave = async (updatedNodes: Node[], updatedEdges: Edge[]) => {
        if (!id || !currentSurvey) return;
        try {
            await axiosInstance.put(`/api/surveys/${id}`, {
                title: currentSurvey.title,
                nodes: updatedNodes,
                edges: updatedEdges,
            });
            showToast('Survey saved successfully!', 'success')
        } catch (error) {
            console.error('Error saving survey:', error);
            showToast('Failed to save survey', 'error')
        }
    };

    const handlePublish = async () => {
        if (!id || !currentSurvey) return;
        try {
            await axiosInstance.put(`/api/surveys/${id}`, {
                status: 'published'
            });
            dispatch(setCurrentSurvey({ ...currentSurvey, status: 'published' }));
           
            showToast('Survey published successfully!','success')
        } catch (error) {
            console.error('Error publishing survey:', error);
            showToast('Failed to publish survey','error')
        }
    };

    const handleExport = (format: 'json' | 'csv') => {
        const data = {
            title: currentSurvey?.title,
            nodes,
            edges,
        };

        if (format === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${currentSurvey?.title || 'survey'}-logic.json`;
            link.click();
        } else {
            // Simple CSV export for nodes
            const headers = 'id,type,label\n';
            const rows = nodes.map(n => `${n.id},${n.type},${n.data?.label || ''}`).join('\n');
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${currentSurvey?.title || 'survey'}-nodes.csv`;
            link.click();
        }
    };

    const calculateEligibility = () => {
        const eligibleCount = nodes.filter((n) => n.type === 'eligible').length;
        const ineligibleCount = nodes.filter((n) => n.type === 'ineligible').length;
        const totalPaths = eligibleCount + ineligibleCount;

        if (totalPaths === 0) return 0;
        return Math.round((eligibleCount / totalPaths) * 100);
    };

    if (loading && !currentSurvey) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 4 }} />
            </Box>
        );
    }

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Breadcrumbs sx={{ mb: 1 }}>
                        <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
                            Dashboard
                        </Link>
                        <Typography color="text.primary">Builder</Typography>
                    </Breadcrumbs>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {currentSurvey?.title || 'New Survey'}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            px: 2,
                            py: 1,
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: 2,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, display: 'block' }}>
                            ELIGIBILITY RATE
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 800 }}>
                            {calculateEligibility()}%
                        </Typography>
                    </Paper>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleExport('json')}
                    >
                        Export Logic
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PublishIcon />}
                        onClick={handlePublish}
                        disabled={currentSurvey?.status === 'published'}
                        color="primary"
                    >
                        {currentSurvey?.status === 'published' ? 'Published' : 'Publish'}
                    </Button>
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Sidebar />
                <Box sx={{ flexGrow: 1, position: 'relative' }}>
                    <FlowEditor
                        initialData={{ nodes, edges }}
                        onSave={(n, e) => {
                            setNodes(n);
                            setEdges(e);
                            handleSave(n, e);
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Builder;
