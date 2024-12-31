import {UserMetadata} from "@supabase/supabase-js";
import React from "react";
import HeaderLayout from "../../layout/HeaderLayout";
import FooterLayout from "../../layout/FooterLayout";
import {Navigate, Outlet} from "react-router-dom";

interface Props{
    session:UserMetadata|null;
}

const Main:React.FC<Props> = ({session}) => {
    {/* 페이지 진입시 로그인 유무 체크 */}
    if(!session) return <Navigate to={'/login'}/>
    return (
        <div>
            <HeaderLayout userId={session?.user.email || ''} userData={session?.user.user_metadata}>
                <></>
            </HeaderLayout>
            <main className="main-content">
                <Outlet/>
            </main>
            <FooterLayout userinfo={session.user}/>
        </div>
    );
}
export default Main;