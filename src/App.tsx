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
                {/* 로그인전 */}
                <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/" replace />} />
                <Route path="/signup" element={!session ? <SignUpPage /> : <Navigate to="/" replace />} />
                {/* 로그인후 */}
                <Route path="/" element={<Main session={session} />} >
                    <Route path="/accountInfo" element={<AccountInfo userData={session?.user}/>}/>
                    <Route path="/coverLetter" element={<CoverLetterPage />}/>
                    <Route path="/selfIntroduction" element={<SelfIntroduction userData={session?.user}/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
