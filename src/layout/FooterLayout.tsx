import {Button} from "@mui/material";
import React, {useState} from "react";
import ChatPopup from "../componets/chat/ChatPopup";
// import {UserMetadata} from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";

interface FooterLayoutProps {
    userinfo: User,
}

const FooterLayout: React.FC<FooterLayoutProps> = ({userinfo}) => {
    const [open, setOpen] = useState(false);
    const changeHandle = () => setOpen(!open);

    return (
        <>
            <Button onClick={changeHandle} sx={{
                borderRadius: '50%',
                minWidth: '56px',
                width: '56px',
                height: '56px',
                padding: 0,
                color: 'black',
                border: '1px solid black',
                position: 'fixed',
                bottom: '50px',
                right: '50px'
            }}>채팅</Button>
            {open && <ChatPopup right={'45px'} top={'50px'} popupHandle={changeHandle}  userinfo={userinfo}/>}
        </>
    )
}
export default FooterLayout;