import {
    Avatar,
    DialogContent,
    List,
    ListItem, ListItemAvatar,
    ListItemText, Paper, Tab, Tabs, Typography,
} from "@mui/material";
import React, {useState} from "react";

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
interface Props{
    top:string;
    right:string;
    popupHandle?:()=>void;
}
const ChatPopup = ({top,right,popupHandle}:Props) => {
    const [value, setValue] = useState<Value>('friend');

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };
    return (
        <Paper sx={{
            width: 450,
            height: 650,
            position: 'fixed',
            top: top,
            right: right,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Tabs value={value} onChange={handleChange} textColor="inherit" indicatorColor="secondary"
                  style={{backgroundColor: '#f0f0f0'}}>
                <Tab label={'친구'} value={'friend'}/>
                <Tab label={'채팅'} value={'chat'}/>
            </Tabs>
            <button style={{position:'absolute',right:'0', width:'80px',height:'49px'}} onClick={()=> popupHandle?.()}>close</button>
            <DialogContent >
                <List >
                    {value === 'chat' &&
                        dummyChatRooms.map((chatRoom) => (
                            <ListItem key={chatRoom.id}>
                                <Avatar >{chatRoom.name.toUpperCase()}</Avatar>
                                <ListItemText sx={{fontSize: '20px'}} primary={chatRoom.name}/>
                            </ListItem>
                        ))}
                    {value === 'friend' &&
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