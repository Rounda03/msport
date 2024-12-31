import React, {useState, useEffect} from 'react';
import {Paper, Tabs, Tab, Box, Button, Badge} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FriendList from './FriendList';
import ChatList from './ChatList';
import FriendSearch from './FriendSearch';
import FriendRequests from './FriendRequests';
import supabase from '../../supabaseClient';
import {User} from "@supabase/supabase-js";
import RequestList from "./RequestList";
import NotificationList from "./NotificationList";
import ChatRoom from "./ChatRoom";
interface Friend {
    id: string;
    nickname: string;
}
interface ChatPopupProps {
    top: string,
    right: string,
    userinfo: User,
    popupHandle?: () => void
}

const ChatPopup: React.FC<ChatPopupProps> = ({top, right, userinfo, popupHandle}) => {
    const [value, setValue] = useState<'friend' | 'chat'| 'request'|'notifications'>('friend');
    const [showSearch, setShowSearch] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [alarms, setalarms] = useState(0);
    const [friends, setFriends] = useState<Friend[]>([]);
    // const [chatRooms, setChatRooms] = useState<any[]>([]);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState<number | null>(null);
    const handleChatRoomSelect = (chatRoomId: number) => {
        setSelectedChatRoomId(chatRoomId);
        setValue('chat');
    };
    useEffect(() => {
        // fetchFriendRequests();
        fetchFriends();
        // fetchChatRooms();
        console.log('ChatPopup.tsx: useEffect',alarms);
    }, []);
    const handleFriendRequestClick = () => {
        setValue('request');
    };
    // const fetchFriendRequests = async () => {
    //     const {data} = await supabase
    //         .from('friends')
    //         .select('*')
    //         .eq('friend_id', userinfo.id)
    //         .is('accepted', false);
    //     if (data) setFriendRequests(data);
    // };
    const handleBackToChatList = () => {
        setSelectedChatRoomId(null);
    };
    useEffect(() => {
        const channel = supabase
            .channel('notifications')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications' },
                (payload) => {
                    if (payload.new.user_id === userinfo.id) {
                        setalarms((prev) => prev + 1);
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'notifications' },
                (payload) => {
                    // is_read 상태가 변경되었을 때
                    if (payload.new.user_id === userinfo.id && payload.new.is_read !== payload.old.is_read) {
                        if (payload.new.is_read === true) {
                            setalarms((prev) => Math.max(prev - 1, 0)); // 읽었으면 알람 개수 감소
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userinfo.id]);
    useEffect(() => {
        const fetchUnreadNotifications = async () => {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact' })
                .eq('user_id', userinfo.id)
                .eq('read', false);

            if (!error && count !== null) {
                setalarms(count);
            }
        };

        fetchUnreadNotifications();
    }, [userinfo.id]);

    // const fetchFriends = async () => {
    //     const {data} = await supabase
    //         .from('friends')
    //         .select('*, friend:friend_id(friend_nickname)')
    //         .eq('user_id', userinfo.id)
    //         .eq('accepted', 'true');
    //     if (data) setFriends(data.map(item => item.friend));
    // };
    const fetchFriends = async () => {
        const { data, error } = await supabase
            .from('friends')
            .select('friend_id, friend_nickname')
            .eq('user_id', userinfo.id)
            .eq('accepted', true);

        if (error) {
            console.error('Error fetching friends:', error);
            return;
        }

        if (data) {
            const formattedFriends: Friend[] = data.map(item => ({
                id: item.friend_id, // `friend_id`를 `id`로 매핑
                nickname: item.friend_nickname, // `nickname` 값을 사용
            }));
            setFriends(formattedFriends);
        }
    };


    // const fetchChatRooms = async () => {
    //     const {data} = await supabase
    //         .from('chat_participants')
    //         .select('chat_room_id')
    //         .eq('user_id', userinfo.id);
    //
    //     if (data) {
    //         const roomIds = data.map(item => item.chat_room_id);
    //         const {data: rooms} = await supabase
    //             .from('chat_rooms')
    //             .select('*')
    //             .in('id', roomIds);
    //         if (rooms) setChatRooms(rooms);
    //     }
    // };


    //채팅
    const onChatStart = (chatRoomId: string) => {
        // 채팅 시작 로직 구현
        console.log(`Starting chat in room: ${chatRoomId}`);
        setValue('chat'); // 채팅 탭으로 전환
    };
    return (
        <Paper sx={{
            width: 450,
            height: 650,
            position: 'absolute',
            top: top,
            right: right,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}>
                    <Tab label="친구" value="friend" />
                    <Tab label="채팅" value="chat" />
                    <Tab label="요청" value="request" />
                    <Tab
                        icon={
                            <Badge badgeContent={alarms} color={alarms > 0 ? "warning" : "default"}>
                                <NotificationsIcon />
                            </Badge>
                        }
                        value="notifications"
                        onClick={() => setValue('notifications')}
                    />
                </Tabs>
            </Box>
            {value === 'friend' && <FriendList friends={friends} userinfo={userinfo} onChatStart={onChatStart} />}
            {value === 'chat' && (
                selectedChatRoomId ? (
                    <ChatRoom chatRoomId={selectedChatRoomId} userinfo={userinfo} onBack={handleBackToChatList}/>
                ) : (
                    <ChatList userinfo={userinfo} onChatRoomSelect={handleChatRoomSelect} />
                )
            )}
            {value === 'request' && <RequestList userinfo={userinfo} />}
            {value === 'notifications' && (
                <NotificationList
                    userinfo={userinfo}
                    onFriendRequestClick={handleFriendRequestClick}
                />
            )}
        </Paper>
    );
};

export default ChatPopup;
