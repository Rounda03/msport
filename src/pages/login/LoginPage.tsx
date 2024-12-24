import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient'; // supabase 클라이언트 import
import '../../index.css';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            // 로그인 성공
            navigate('/main');
        } catch (error : any) {
            alert('로그인 실패: ' + error.message);
        }
    };

    const handleSignUpRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">로그인</button>
                </form>
                <button className={'signup'} onClick={handleSignUpRedirect} style={{marginTop: 10}}>회원가입</button>
            </div>
        </div>
    );
};

export default LoginPage;