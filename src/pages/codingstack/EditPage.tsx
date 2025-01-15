import React, { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import supabase from '../../supabaseClient'; // supabase 클라이언트 import
import {Grid, Paper, TextField, Switch, IconButton, Typography, Button, Stack} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface CodeSnippet {
    id: string;
    title: string;
    code: string;
    is_shown: boolean;
    order_position: number;
}
const scope = { React, Stack, Button };

const EditPage: React.FC = () => {
    const [snippets, setSnippets] = useState<CodeSnippet[]>([]);

    useEffect(() => {
        fetchSnippets();
    }, []);

    const fetchSnippets = async () => {
        const { data, error } = await supabase
            .from('code_snippets')
            .select('*')
            .order('order_position', { ascending: true });
        if (error) console.error('Error fetching snippets:', error);
        else setSnippets(data || []);
    };

    const addSnippet = () => {
        const newPosition = snippets.length > 0 ? Math.max(...snippets.map(s => s.order_position)) + 1 : 0;
        setSnippets([...snippets, {
            id: Date.now().toString(),
            title: 'New Snippet',
            code: '',
            is_shown: false,
            order_position: newPosition
        }]);
    };

    const updateSnippet = (id: string, field: keyof CodeSnippet, value: any) => {
        setSnippets(snippets.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removeSnippet = (id: string) => {
        setSnippets(snippets.filter(s => s.id !== id));
    };

    const moveSnippet = (id: string, direction: 'up' | 'down') => {
        const index = snippets.findIndex(s => s.id === id);
        if ((direction === 'up' && index > 0) || (direction === 'down' && index < snippets.length - 1)) {
            const newSnippets = [...snippets];
            const temp = newSnippets[index].order_position;
            newSnippets[index].order_position = newSnippets[index + (direction === 'up' ? -1 : 1)].order_position;
            newSnippets[index + (direction === 'up' ? -1 : 1)].order_position = temp;
            setSnippets(newSnippets.sort((a, b) => a.order_position - b.order_position));
        }
    };

    const saveSnippets = async () => {
        const { data, error } = await supabase.from('code_snippets').upsert(snippets);
        if (error) console.error('Error saving snippets:', error);
        else console.log('Snippets saved successfully');
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4">Code Snippets Editor</Typography>
                <Button onClick={addSnippet} variant="contained" color="primary">
                    Add Snippet
                </Button>
                <Button onClick={saveSnippets} variant="contained" color="secondary">
                    Save All Snippets
                </Button>
            </Grid>
            {snippets.map((snippet, index) => (
                <Grid item xs={12} key={snippet.id}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Snippet Title"
                                    value={snippet.title}
                                    onChange={e => updateSnippet(snippet.id, 'title', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} container alignItems="center" justifyContent="flex-end">
                                <Switch
                                    checked={snippet.is_shown}
                                    onChange={e => updateSnippet(snippet.id, 'is_shown', e.target.checked)}
                                />
                                <Typography>Show in public</Typography>
                                <IconButton onClick={() => removeSnippet(snippet.id)}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton onClick={() => moveSnippet(snippet.id, 'up')} disabled={index === 0}>
                                    <ArrowUpwardIcon />
                                </IconButton>
                                <IconButton onClick={() => moveSnippet(snippet.id, 'down')} disabled={index === snippets.length - 1}>
                                    <ArrowDownwardIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LiveProvider code={snippet.code} scope={scope}>
                                    <LiveEditor onChange={code => updateSnippet(snippet.id, 'code', code)} />
                                </LiveProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LiveProvider code={snippet.code} scope={scope}>
                                    <LiveError />
                                    <LivePreview />
                                </LiveProvider>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default EditPage;