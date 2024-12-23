import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import supabase from './supabaseClient';

import HeaderLayout from './layout/HeaderLayout';
import Samplepage from "./pages/sample/samplepage";
import LoginPage from "./pages/login/LoginPage";
import SignUpPage from "./pages/login/SignUpPage";

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
                <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/sample" replace />} />
                <Route path="/signup" element={!session ? <SignUpPage /> : <Navigate to="/sample" replace />} />
                <Route path="/sample" element={
                    session ? (
                        <HeaderLayout userId={session.user.email || ''}>
                            <Samplepage />
                        </HeaderLayout>
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } />
                <Route path="/" element={<Navigate to={session ? "/sample" : "/login"} replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
