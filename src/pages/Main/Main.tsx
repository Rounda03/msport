import {UserMetadata} from "@supabase/supabase-js";
import React from "react";
import HeaderLayout from "../../layout/HeaderLayout";
import FooterLayout from "../../layout/FooterLayout";
import {Navigate} from "react-router-dom";

interface Props{
    session:UserMetadata|null;
    children?:React.ReactNode;
}

const Main:React.FC<Props> = ({session,children}) => {
    if(!session) return <Navigate to={'/login'}/>
    return (
        <div>
            <HeaderLayout userId={session?.user.email || ''} userData={session?.user.user_metadata}>
                <></>
            </HeaderLayout>
            <main className="main-content">
                {children}
            </main>
            <FooterLayout userinfo={session.user}/>
        </div>
    );
}
export default Main;