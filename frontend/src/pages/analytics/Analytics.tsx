import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    CheckCircle as SuccessIcon,
    Timeline as TimelineIcon,
} from '@mui/icons-material';

import axiosInstance from '../../api/axiosInstance';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = React.useState({
        totalSurveys: 0,
        publishedSurveys: 0,
        totalResponses: 0,
        avgEligibilityRate: 0,
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axiosInstance.get('/api/surveys/analytics');
                setAnalyticsData(response.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const stats = [
        { title: 'Total Surveys', value: analyticsData.totalSurveys, icon: <TimelineIcon color="primary" />, trend: 'Active' },
        { title: 'Published Flows', value: analyticsData.publishedSurveys, icon: <SuccessIcon color="secondary" />, trend: 'Live' },
        { title: 'Total Responses', value: analyticsData.totalResponses, icon: <PeopleIcon color="success" />, trend: 'All time' },
        { title: 'Avg. Eligibility', value: `${analyticsData.avgEligibilityRate}%`, icon: <TrendingUpIcon color="warning" />, trend: 'Rate' },
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>
                Analytics Overview
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
                        <Card variant="outlined">
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ p: 1, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2 }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {stat.trend}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {stat.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        sx={{
                            p: 3,
                            height: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Eligibility Performance over Time
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            (Chart would render here using Recharts or similar)
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        sx={{
                            p: 3,
                            height: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                width: 150,
                                height: 150,
                                borderRadius: '50%',
                                border: '15px solid rgba(99, 102, 241, 0.1)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mb: 4,
                            }}
                        >
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                {analyticsData.avgEligibilityRate}%
                            </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            Pass Rate
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            Target: 70% for current quarter
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;
