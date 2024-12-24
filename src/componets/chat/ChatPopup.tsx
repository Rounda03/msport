import {
    Avatar,
    Button,
    DialogContent,
    List,
    ListItem, ListItemAvatar,
    ListItemText, Paper, Tab, Tabs, Typography,
} from "@mui/material";
import React, {useState} from "react";

interface Message {
    text: string;
    sender: string;
}
type Value = 'friend' | 'chat';

const dummyChatRooms = [
    {
        id: 'new1',
        name: 'chat1',
        lastMsg: 'asdf'
    },
    {
        id: 'new2',
        name: 'chat2',
        lastMsg: 'asdf'
    },
    {
        id: 'new3',
        name: 'chat3',
        lastMsg: 'asdf'
    },
]
const dummyFriends = [
    {
        userId: 'friend1',
        name: 'friend1',
        description: '소개1',
    },
    {
        userId: 'friend2',
        name: 'friend2',
        description: '소개2',
    },
    {
        userId: 'friend3',
        name: 'friend3',
        description: '소개3',
    },
]

const ChatPopup = () => {
    const [value, setValue] = useState<Value>('friend');

    const handleChange = (event: any, newValue: any) => {
        console.log('newValue', newValue);
        setValue(newValue);
    };
    return (
        <Paper sx={{
            width: 450,
            height: 650,
            position: 'absolute',
            top: 'px',
            right: 'px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Tabs value={value} onChange={handleChange} textColor="inherit" indicatorColor="secondary"
                  style={{backgroundColor: '#f0f0f0'}}>
                <Tab label={'친구'} value={'friend'}/>
                <Tab label={'채팅'} value={'chat'}/>
            </Tabs>

            <DialogContent style={{border: '1px solid red'}}>
                <List style={{border: '1px solid red'}}>
                    {value === 'friend' &&
                        dummyChatRooms.map((chatRoom) => (
                            <ListItem key={chatRoom.id}>
                                <Avatar >{chatRoom.name.toUpperCase()}</Avatar>
                                <ListItemText sx={{fontSize: '20px'}} primary={chatRoom.name}/>
                            </ListItem>
                        ))}
                    {value === 'chat' &&
                        dummyFriends.map((friend) => (
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="" src=""/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={friend.name}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                sx={{color: 'text.primary', display: 'inline'}}
                                            >
                                                {friend.description}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        ))}
                </List>
            </DialogContent>
        </Paper>
    )
}
export default ChatPopup;