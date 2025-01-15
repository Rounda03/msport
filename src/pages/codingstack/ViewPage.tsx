import React, { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import supabase from '../../supabaseClient';

interface CodeSnippet {
    id: string;
    title: string;
    code: string;
}

const ViewPage: React.FC = () => {
    const [snippets, setSnippets] = useState<CodeSnippet[]>([]);

    useEffect(() => {
        fetchSnippets();
    }, []);

    const fetchSnippets = async () => {
        const { data, error } = await supabase
            .from('code_snippets')
            .select('*')
            .eq('is_shown', true)
            .order('order_position', { ascending: true });
        if (error) console.error('Error fetching snippets:', error);
        else setSnippets(data || []);
    };

    return (
        <div>
            <h1>Public Code Snippets</h1>
            {snippets.map(snippet => (
                <div key={snippet.id}>
                    <h2>{snippet.title}</h2>
                    <LiveProvider code={snippet.code}>
                        <LiveEditor disabled />
                        <LiveError />
                        <LivePreview />
                    </LiveProvider>
                </div>
            ))}
        </div>
    );
};

export default ViewPage;
