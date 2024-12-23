import React from "react";
import supabase from '../../supabaseClient'; // supabase 클라이언트 import
import { useNavigate } from 'react-router-dom';

const SamplePage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            // 로그아웃 성공 시 로그인 페이지로 리디렉션
            navigate('/login');
        } catch (error: any) {
            alert('로그아웃 중 오류가 발생했습니다: ' + error.message);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    테스트페이지랍니다@@@@@@@@@@@@@
                </a>
                <button onClick={handleLogout} style={{ marginTop: '20px' }}>로그아웃</button>
            </header>
        </div>
    );
};

export default SamplePage;