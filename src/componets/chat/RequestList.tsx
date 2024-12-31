import React, { useState, useEffect } from 'react';
import {List, ListItem, ListItemText, Button, Typography} from '@mui/material';
import supabase from '../../supabaseClient';
import { User } from "@supabase/supabase-js";

interface RequestListProps {
    userinfo: User;
}

const RequestList: React.FC<RequestListProps> = ({ userinfo }) => {
    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => {
        fetchRequests();
        subscribeToRequests();
    }, []);

    const fetchRequests = async () => {
        const { data } = await supabase
            .from('friends')
            .select('*')
            .eq('friend_id', userinfo.id)
            .eq('accepted', 'false')
            .eq('status', 'pending');
        if (data) setRequests(data);
        console.log('RequestList.tsx: fetchRequests',requests);
    };

    const subscribeToRequests = () => {
        const channel = supabase
            .channel('friends_changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'friends', filter: `friend_id=eq.${userinfo.id}` },
                () => fetchRequests()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const handleRequest = async (requestId: string, friendId: string, action: 'accepted' | 'refused') => {
        try {
            // 기존 요청 업데이트
            const { error } = await supabase
                .from('friends')
                .update({ status: action, accepted: action === 'accepted' })
                .eq('id', requestId);

            if (error) throw error;

            if (action === 'accepted') {
                // 반대 방향의 친구 관계 생성
                const { error: reverseError } = await supabase
                    .from('friends')
                    .insert({ user_id: userinfo.id, friend_id: friendId, accepted: true, status: 'accepted',user_nickname:userinfo.user_metadata.nickname,friend_nickname:requests.find(request=>request.id===requestId)?.user_nickname });

                if (reverseError) throw reverseError;
            }
            await supabase
                .from('notifications')
                .insert({
                    user_id: friendId,
                    type: 'friend_request',
                    content: `${userinfo.user_metadata.nickname}님이 친구 요청을 수락했습니다.`,
                    related_id: userinfo.id
                });

            // 요청 목록 새로고침
            fetchRequests();

        } catch (error) {
            console.error('친구 요청 처리 실패:', error);
        }
    };


    return (
        <List>
            {requests.length>0?null:<Typography variant="h6">요청이 없어요</Typography>}
            {requests.map((request) => (
                <ListItem key={request.id}>
                    <ListItemText primary={request.user_nickname} />
                    <Button onClick={() => handleRequest(request.id, request.user_id, 'accepted')}>수락</Button>
                    <Button onClick={() => handleRequest(request.id, request.user_id, 'refused')}>거절</Button>
                </ListItem>
            ))}
        </List>
    );
};

export default RequestList;
