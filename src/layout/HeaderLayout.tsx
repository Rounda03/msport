import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import '../css/Layout.css';
import {AppBar, Tabs, Tab, Box, Button, Avatar, Badge} from '@mui/material';

interface HeaderLayoutProps {
    children: React.ReactNode;
    userId: string;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ children, userId }) => {
    const navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(0);
    const [value, setValue] = useState(0);

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };
    const items = [
        { label: '홈', icon: 'pi pi-fw pi-home' },
        { label: '프로필', icon: 'pi pi-fw pi-user' },
        { label: '설정', icon: 'pi pi-fw pi-cog' }
    ];

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="header-layout">
            <header className="header">
                <h1>My App</h1>
                <Box>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        style={{marginRight:'5px'}}
                    >
                        <Avatar alt="Travis Howard" src="" />
                    </Badge>
                    <span>{userId}</span>
                    <Button onClick={handleLogout}>로그아웃</Button>
                </Box>
            </header>
            <Tabs value={value} onChange={handleChange} textColor="inherit" indicatorColor="secondary">
                <Tab label="홈" />
                <Tab label="프로필" />
                <Tab label="설정" />
            </Tabs>
            <main className="main-content">{children}</main>
        </div>
    );
};

export default HeaderLayout;
