import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import supabase from './supabaseClient';

import LoginPage from "./pages/login/LoginPage";
import SignUpPage from "./pages/login/SignUpPage";
import AccountInfo from "./pages/account/AccountInfo";
import SelfIntroduction from "./pages/selfintroduction/SelfIntroduction";
import CoverLetterPage from "./pages/CoverLetter/CoverLetterPage";
import Main from "./pages/Main/Main";
import TestImg from "./pages/PortfolioImg/testimg";
import EditPage from "./pages/codingstack/EditPage";
import ViewPage from "./pages/codingstack/ViewPage";

function App() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/*페이지 진입시 로그인 유무 체크*/}
                <Route path="/" element={!session ?<Navigate to="/login" replace />:<Navigate to="/main" replace />} />
                {/*로그인전*/}
                <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/main" replace />} />
                <Route path="/signup" element={!session ? <SignUpPage /> : <Navigate to="/main" replace />} />
                {/*로그인후*/}
                <Route path="/main" element={<Main session={session} />} />
                <Route path="/accountInfo" element={
                    <Main session={session} >
                        <AccountInfo  userData={session?.user}/>
                    </Main>}/>
                <Route path="/coverLetter" element={
                    <Main session={session} >
                        <CoverLetterPage />
                    </Main>}/>
                <Route path="/selfIntroduction" element={
                    <Main session={session} >
                        <SelfIntroduction userData={session?.user}/>
                    </Main>} />
                <Route path="/testpage" element={
                    <Main session={session} >
                        <TestImg />
                    </Main>}/>
                <Route path="/codeedit" element={
                    <Main session={session} >
                        <EditPage userData={session?.user}/>
                    </Main>}/>
                <Route path="/codeview" element={
                    <Main session={session} >
                        <ViewPage userData={session?.user}/>
                    </Main>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
