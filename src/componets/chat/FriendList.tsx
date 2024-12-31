import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography, Box, Fab, Popover, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import FriendSearch from './FriendSearch';
import { User } from "@supabase/supabase-js";
import { createChatRoom } from './chatutils';

interface Friend {
    id: string;
    nickname: string;
}

interface FriendListProps {
    friends: Friend[];
    userinfo: User;
    onChatStart: (chatRoomId: string) => void;
}

const FriendList: React.FC<FriendListProps> = ({ friends, userinfo, onChatStart }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChatStart = async (friendId: string) => {
        try {
            const chatRoom = await createChatRoom(userinfo, [friendId]);
            onChatStart(chatRoom.id);
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    const open = Boolean(anchorEl);

    return (
        <Box sx={{ position: 'relative', height: '100%' }}>
            <List>
                {friends.length > 0 ? null : <Typography variant="h6">친구가 없어요</Typography>}
                {friends.map((friend) => (
                    <ListItem key={friend.id} secondaryAction={
                        <Button
                            startIcon={<ChatIcon />}
                            onClick={() => handleChatStart(friend.id)}
                        >
                            대화
                        </Button>
                    }>
                        <ListItemText primary={friend.nickname} />
                    </ListItem>
                ))}
            </List>
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                onClick={handleClick}
            >
                <AddIcon />
            </Fab>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <FriendSearch onClose={handleClose} userinfo={userinfo} friends={friends}/>
            </Popover>
        </Box>
    );
};

export default FriendList;
