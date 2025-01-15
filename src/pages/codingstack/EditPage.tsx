import React, { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import supabase from '../../supabaseClient'; // supabase 클라이언트 import
import {Grid, Paper, TextField, Switch, IconButton, Typography, Button, Stack} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { User } from "@supabase/supabase-js";

interface Props {
    userData?: User;
}
interface CodeSnippet {
    id?: number;
    user_id: string;
    title: string;
    code: string;
    is_shown: boolean;
    order_position: number;
    is_del?: boolean;
}
const scope = { React, Stack, Button };

const EditPage: React.FC<Props> = ( {userData} ) => {
    const [snippets, setSnippets] = useState<CodeSnippet[]>([]);

    useEffect(() => {
        if (userData) {
            fetchSnippets();
        }
    }, [userData]);

    const fetchSnippets = async () => {
        if (!userData?.id) return;

        const { data, error } = await supabase
            .from('code_snippets')
            .select('*')
            .eq('user_id', userData.id)
            .eq('is_del', false)
            .order('order_position', { ascending: true });

        if (error) console.error('Error fetching snippets:', error);
        else setSnippets(data || []);
    };

    const addSnippet = () => {
        if (!userData?.id) return;

        const newPosition = snippets.length > 0 ? Math.max(...snippets.map(s => s.order_position)) + 1 : 0;
        const newSnippet: CodeSnippet = {
            user_id: userData.id,
            title: 'New Snippet',
            code: '',
            is_shown: false,
            order_position: newPosition
        };
        setSnippets([...snippets, newSnippet]);
    };

    const updateSnippet = (id: number, field: keyof CodeSnippet, value: any) => {
        setSnippets(snippets.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removeSnippet = (id: number) => {
        setSnippets(snippets.map(s => s.id === id ? { ...s, is_del: true } : s));
    };

    const moveSnippet = (id: number, direction: 'up' | 'down') => {
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
        const snippetsToInsert = snippets.filter(s => !s.id);
        const snippetsToUpdate = snippets.filter(s => s.id);

        // 새로운 스니펫 삽입
        if (snippetsToInsert.length > 0) {
            const { error: insertError } = await supabase
                .from('code_snippets')
                .insert(snippetsToInsert);
            if (insertError) console.error('Error inserting snippets:', insertError);
        }

        // 기존 스니펫 업데이트
        if (snippetsToUpdate.length > 0) {
            const { error: updateError } = await supabase
                .from('code_snippets')
                .upsert(snippetsToUpdate);
            if (updateError) console.error('Error updating snippets:', updateError);
        }

        // 저장 후 스니펫 다시 불러오기
        await fetchSnippets();

        console.log('Snippets saved successfully');
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
            {snippets.filter(snippet => !snippet.is_del).map((snippet, index) => (
                <Grid item xs={12} key={snippet.id!}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Snippet Title"
                                    value={snippet.title}
                                    onChange={e => updateSnippet(snippet.id!, 'title', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} container alignItems="center" justifyContent="flex-end">
                                <Switch
                                    checked={snippet.is_shown}
                                    onChange={e => updateSnippet(snippet.id!, 'is_shown', e.target.checked)}
                                />
                                <Typography>Show in public</Typography>
                                <IconButton onClick={() => removeSnippet(snippet.id!)}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton onClick={() => moveSnippet(snippet.id!, 'up')} disabled={index === 0}>
                                    <ArrowUpwardIcon />
                                </IconButton>
                                <IconButton onClick={() => moveSnippet(snippet.id!, 'down')} disabled={index === snippets.length - 1}>
                                    <ArrowDownwardIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LiveProvider code={snippet.code} scope={scope}>
                                    <LiveEditor onChange={code => updateSnippet(snippet.id!, 'code', code)} />
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