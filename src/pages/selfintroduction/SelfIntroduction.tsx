import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import supabase from '../../supabaseClient';
import { User } from "@supabase/supabase-js";
interface SelfIntroductionProps {
    userData?: User;
}

const SelfIntroduction:React.FC<SelfIntroductionProps> = ({ userData }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        const { data, error } = await supabase
            .from('self_introductions')
            .select('content')
            .eq('user_id', userData?.email)
            .single();

        if (data) setContent(data.content);
    };

    const saveContent = async () => {
        const { data, error } = await supabase
            .from('self_introductions')
            .upsert({ user_id: userData?.email, content }, { onConflict: 'user_id' });

        if (error) console.error('Error saving content:', error);
        else console.log('Content saved successfully');
    };

    return (
        <div>
            <SimpleMDE value={content} onChange={setContent} />
            <button onClick={saveContent}>저장</button>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};

export default SelfIntroduction;
