import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemButton  } from '@mui/material';
import supabase from '../../supabaseClient';
import { User } from "@supabase/supabase-js";

interface ChatRoom {
    id: number;
    name: string;
    is_group: boolean;
}

interface ChatListProps {
    chatRooms?: ChatRoom[];
    userinfo: User;
    onChatRoomSelect: (chatRoomId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ userinfo , onChatRoomSelect}) => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    useEffect(() => {
        fetchChatRooms();
        const subscription = supabase
            .channel('chat_rooms')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, fetchChatRooms)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchChatRooms = async () => {
        const { data, error } = await supabase
            .from('chat_room_members')
            .select('chat_room_id, chat_rooms(id, name, is_group)')
            .eq('user_id', userinfo.id)
            .is('left_at', null);

        if (error) {
            console.error('Error fetching chat rooms:', error);
            return;
        }

        if (data) {
            const chatRooms: ChatRoom[] = data
                .map((item) => {
                    const chatRoomData = item.chat_rooms;
                    // 단일 객체 또는 배열 처리
                    return Array.isArray(chatRoomData) ? chatRoomData[0] : chatRoomData;
                })
                .filter((chatRoom): chatRoom is ChatRoom => !!chatRoom); // 유효한 데이터만 필터링
            setChatRooms(chatRooms);
        }
    };




    return (
        <List>
            {chatRooms.length === 0 ? (
                <ListItem>
                    <ListItemText primary="채팅방이 없습니다." />
                </ListItem>
            ) : (
                chatRooms.map((chatRoom) => (
                    <ListItemButton key={chatRoom?.id} onClick={() => onChatRoomSelect(chatRoom.id)}>
                        <ListItemText
                            primary={chatRoom?.name}
                            secondary={chatRoom?.is_group ? '그룹 채팅' : '1:1 채팅'}
                        />
                    </ListItemButton>
                ))
            )}
        </List>
    );
};

export default ChatList;
