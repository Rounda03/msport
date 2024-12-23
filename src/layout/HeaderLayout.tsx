import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import '../css/Layout.css';
import {AppBar, Tabs, Tab, Box, Button, Avatar, Badge, Menu, MenuItem, styled, createTheme,} from '@mui/material';

interface HeaderLayoutProps {
    children: React.ReactNode;
    userId: string;
    userAvatar?: string;
}


const StyledTabs = styled(Tabs)(({ theme }) => ({
    marginTop: theme.spacing(1),
    '& .MuiTab-root': {
        fontSize: '1.1rem',
        fontWeight: 500,
        textTransform: 'none',
        minWidth: 100,
        '&.Mui-selected': {
            color: theme.palette.secondary.main,
        },
    },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        backgroundColor: theme.palette.grey[100],
        boxShadow: theme.shadows[3],
    },
}));

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ children, userId, userAvatar }) => {
    const navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(0);
    const [value, setValue] = useState(0);
    const [userdetailpopup,setUserDetailPopup] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClose = () => {
        setAnchorEl(null);
    };
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

    const IdMouseClick = async (event: any) => {
        setAnchorEl(event.currentTarget);
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
                    <span onClick={(e)=>IdMouseClick(e)}>{userId}</span>
                    <Button onClick={handleLogout}>로그아웃</Button>
                    <StyledMenu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>계정 정보</MenuItem>
                        <MenuItem onClick={handleClose}>포트폴리오 정보</MenuItem>
                        <MenuItem onClick={handleClose}>친구 목록</MenuItem>
                        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                    </StyledMenu>
                </Box>
            </header>
            <Tabs value={value} onChange={handleChange} textColor="inherit" indicatorColor="secondary" style={{backgroundColor: '#f0f0f0'}}>
                <Tab label="홈" />
                <Tab label="자기소개서" />
                <Tab label="포트폴리오" />
                <Tab label="사용기술" />
                <Tab label="커뮤니티" />
            </Tabs>
            <main className="main-content">{children}</main>
        </div>
    );
};

export default HeaderLayout;
