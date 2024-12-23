import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase  from '../../supabaseClient';
import '../../index.css';

const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name,
                        nickname: nickname,
                    }
                }
            });

            if (error) throw error;

            alert('회원가입이 완료되었습니다. 이메일을 확인해주세요.');
            navigate('/login');
        } catch (error: any) {
            alert('회원가입 중 오류가 발생했습니다: ' + error.message);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Create an Account</h2>
                <form onSubmit={handleSignUp}>
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호재확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit">가입하기</button>
                </form>
                <p>
                    Already have an account?{' '}
                    <span className="login-link" onClick={() => navigate('/')}>
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;