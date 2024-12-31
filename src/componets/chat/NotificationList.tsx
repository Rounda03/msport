import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import supabase from '../../supabaseClient';
import { User } from "@supabase/supabase-js";

interface NotificationListProps {
    userinfo: User;
    onFriendRequestClick: () => void;
}

interface Notification {
    id: string;
    type: string;
    content: string;
    created_at: string;
    is_read: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({ userinfo, onFriendRequestClick }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        fetchNotifications();
        const subscription = subscribeToNotifications();
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userinfo.id)
            .order('created_at', { ascending: false });
        if (data) setNotifications(data);
    };

    const subscribeToNotifications = () => {
        return supabase
            .channel('notifications_changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userinfo.id}` },
                () => fetchNotifications()
            )
            .subscribe();
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (notification.type === 'friend_request') {
            onFriendRequestClick();
        }

        if (!notification.is_read) {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notification.id);

            if (!error) {
                setNotifications(notifications.map(n =>
                    n.id === notification.id ? { ...n, is_read: true } : n
                ));
            }
        }
    };

    return (
        <List>
            <Typography variant="h6">알림</Typography>
            {notifications.map((notification) => (
                <ListItem
                    key={notification.id}
                    component="button"
                    onClick={() => handleNotificationClick(notification)}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <ListItemText
                        primary={notification.content}
                        secondary={new Date(notification.created_at).toLocaleString()}
                    />
                    {notification.is_read && (
                        <Box sx={{ fontSize: '0.8rem', color: 'grey.500', marginLeft: 2 }}>
                            읽음
                        </Box>
                    )}
                </ListItem>
            ))}
        </List>
    );
};

export default NotificationList;
