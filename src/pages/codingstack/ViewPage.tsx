import React, { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import supabase from '../../supabaseClient';
import { User } from "@supabase/supabase-js";
import { Grid, Paper, Typography, Container, Box } from '@mui/material';

interface Props {
    userData?: User;
}
interface CodeSnippet {
    id: string;
    title: string;
    code: string;
}

const ViewPage:  React.FC<Props> = ( {userData} ) => {
    const [snippets, setSnippets] = useState<CodeSnippet[]>([]);

    useEffect(() => {
        fetchSnippets();
    }, []);

    const fetchSnippets = async () => {
        if (!userData?.id) return;

        const { data, error } = await supabase
            .from('code_snippets')
            .select('*')
            .eq('user_id', userData.id)
            .eq('is_shown', true)
            .order('order_position', { ascending: true });

        if (error) console.error('Error fetching snippets:', error);
        else setSnippets(data || []);
    };

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h2" component="h1" gutterBottom align="center">
                    Public Code Snippets
                </Typography>
                <Grid container spacing={3}>
                    {snippets.map(snippet => (
                        <Grid item xs={12} key={snippet.id}>
                            <Paper elevation={3}>
                                <Box p={3}>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        {snippet.title}
                                    </Typography>
                                    <LiveProvider code={snippet.code}>
                                        <Box mb={2}>
                                            <LiveEditor disabled style={{ fontSize: '14px' }} />
                                        </Box>
                                        <LiveError />
                                        <Box mt={2} p={2} bgcolor="background.paper">
                                            <LivePreview />
                                        </Box>
                                    </LiveProvider>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default ViewPage;