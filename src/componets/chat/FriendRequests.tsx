import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Button } from '@mui/material';
import supabase from '../../supabaseClient';
import { User } from "@supabase/supabase-js";

interface FriendRequestsProps {
    onClose: () => void;
    userinfo: User;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ onClose, userinfo }) => {
    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const { data } = await supabase
            .from('friends')
            .select('*, user:user_id(nickname)')
            .eq('friend_id', userinfo.id)
            .is('accepted', false);

        if (data) setRequests(data);
    };

    const acceptRequest = async (requestId: string) => {
        await supabase.from('friends').update({ accepted: true }).eq('id', requestId);
        fetchRequests(); // 요청 수락 후 다시 가져오기
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Friend Requests</DialogTitle>
            <DialogContent>
                <List>
                    {requests.map((request) => (
                        <ListItem key={request.id}>
                            <ListItemText primary={request.user.nickname} />
                            <Button onClick={() => acceptRequest(request.id)}>Accept</Button>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default FriendRequests;
