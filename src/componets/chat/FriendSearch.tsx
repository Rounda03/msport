import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, List, ListItem, ListItemText, Button } from '@mui/material';
import supabase from '../../supabaseClient';
import { User } from "@supabase/supabase-js";

interface Friend {
    id: string;
    nickname: string;
}

interface FriendSearchProps {
    onClose: () => void;
    userinfo: User;
    friends: Friend[];
}

const FriendSearch: React.FC<FriendSearchProps> = ({ onClose, userinfo, friends }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<{ id: string; nickname: string; user_id: string;}[]>([]);
    const [requestedUsers, setRequestedUsers] = useState<Set<string>>(new Set());

    const handleSearch = async () => {
        const { data } = await supabase
            .from('user_profiles')
            .select('id,nickname,user_id')
            .eq('invite_yn', 'Y')
            .neq('email', userinfo.email)
            .ilike('nickname', `%${searchTerm}%`);

        if (data) setSearchResults(data);
    };

    const handleFriendRequest = async (friendId: string) => {
        const { data, error } = await supabase
            .from('friends')
            .insert({ user_id: userinfo.id, friend_id: friendId, accepted: false ,user_nickname:userinfo.user_metadata.nickname,friend_nickname:searchResults.find(user=>user.user_id===friendId)?.nickname});

        if (error) {
            console.error('친구 요청 전송 실패:', error);
            return;
        }

        await supabase
            .from('notifications')
            .insert({
                user_id: friendId,
                type: 'friend_request',
                content: `${userinfo.user_metadata.nickname}님이 친구 요청을 보냈습니다.`,
                related_id: userinfo.id
            });

        setRequestedUsers(prev => new Set(prev).add(friendId));
    };

    const isFriend = (userId: string) => friends.some(friend => friend.id === userId);

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>유저 찾기</DialogTitle>
            <DialogContent>
                <TextField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <List>
                    {searchResults.map((searchuser) => (
                        <ListItem key={searchuser.id}>
                            <ListItemText primary={searchuser.nickname} />
                            {isFriend(searchuser.id) ? (
                                <Button disabled>친구</Button>
                            ) : requestedUsers.has(searchuser.id) ? (
                                <Button disabled>전송완료</Button>
                            ) : (
                                <Button onClick={() => handleFriendRequest(searchuser.user_id)}>
                                    친구요청
                                </Button>
                            )}
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default FriendSearch;
