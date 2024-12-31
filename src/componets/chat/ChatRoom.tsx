import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { User } from "@supabase/supabase-js";
import { subscribeToMessages, sendMessage } from './chatutils';
import supabase from "../../supabaseClient";

interface ChatRoomProps {
    chatRoomId: number;
    userinfo: User;
    onBack: () => void;
}

interface Message {
    id: number;
    content: string;
    user_id: string;
    created_at: string;
    nickname: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatRoomId, userinfo, onBack  }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchMessages(chatRoomId);
        const subscription = subscribeToMessages(chatRoomId, (payload) => {
            setMessages((prev) => [...prev, payload.new]);
            scrollToBottom();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [chatRoomId]);

    const fetchMessages = async (chatRoomId: number) => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_room_id', chatRoomId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            setMessages(data);
        }
    };

    const scrollToBottom = () => {
        const messageList = document.getElementById('message-list');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight+ 300;
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const sentMessage = await sendMessage(userinfo, chatRoomId, newMessage);
            scrollToBottom();
            setNewMessage('');
        }
    };


    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Button onClick={onBack}>Back to Chat List</Button>
            <List id="message-list" sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100% - 160px)',paddingBottom: '25px' }}>
                {messages.map((message) => (
                    <ListItem key={message.id}>
                        <ListItemText
                            primary={`${message.nickname}: ${message.content}`}
                            secondary={new Date(message.created_at).toLocaleString()}
                            sx={{ textAlign: message.user_id === userinfo.id ? 'right' : 'left' }}
                        />
                    </ListItem>
                ))}
                <div style={{ height: '40px' }} /> {/* 추가 공간 */}
            </List>
            <Box sx={{ display: 'flex', p: 1, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <TextField
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>Send</Button>
            </Box>
        </Box>
    );
};

export default ChatRoom;
