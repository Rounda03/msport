import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import supabase from './supabaseClient';

import HeaderLayout from './layout/HeaderLayout';
import Samplepage from "./pages/sample/samplepage";
import LoginPage from "./pages/login/LoginPage";
import SignUpPage from "./pages/login/SignUpPage";
import AccountInfo from "./pages/account/AccountInfo";
import FooterLayout from "./layout/FooterLayout";

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
                {/*로그인전*/}
                <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/sample" replace />} />
                <Route path="/signup" element={!session ? <SignUpPage /> : <Navigate to="/sample" replace />} />
                {/*로그인후*/}
                <Route path="/sample" element={
                    session ? (
                        <HeaderLayout userId={session.user.email || ''} userData={session.user.user_metadata}>
                            <Samplepage />
                            <FooterLayout />
                        </HeaderLayout>
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } />
                <Route path="/accountInfo" element={
                    session ? (
                        <HeaderLayout userId={session.user.email || ''} userData={session.user.user_metadata}>
                            <AccountInfo  userData={session.user}/>
                        </HeaderLayout>
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
