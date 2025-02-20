import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import '../css/Layout.css';
import { Tabs, Tab, Box, Avatar, Badge, Menu, MenuItem, styled, createTheme,} from '@mui/material';
import {UserMetadata} from "@supabase/supabase-js";

interface HeaderLayoutProps {
    children: React.ReactNode;
    userId: string;
    userData?: UserMetadata;
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

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ children, userId, userAvatar, userData }) => {
    const navigate = useNavigate();

    const [value, setValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    // const [activeIndex, setActiveIndex] = useState(0);
    // const [userdetailpopup,setUserDetailPopup] = useState(false);
    const [skillMenuAnchorEl, setSkillMenuAnchorEl] = useState<HTMLElement | null>(null);

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

    const handleMenuItemClick = (path: string) => {
        handleClose();
        navigate(path);
    };
    //사용스택 하위메뉴
    const openSkillMenu = (event: React.MouseEvent<HTMLElement>) => {
        setSkillMenuAnchorEl(event.currentTarget);
    };

    const closeSkillMenu = (nav : string) => {
        setSkillMenuAnchorEl(null);
        navigate(nav);
    }
    return (
        <div className="header-layout">
            <header className="header">
                <h1 onClick={() => navigate('/sample')} style={{cursor: 'pointer'}}>My App</h1>
                <Box>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        style={{marginRight:'5px'}}
                    >
                        <Avatar alt="Travis Howard" src="" />
                    </Badge>
                    <span onClick={IdMouseClick} aria-label="사용자 메뉴 열기" style={{cursor: 'pointer'}}>
                        {userData?.name || userId}님 환영합니다!
                    </span>
                    <StyledMenu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => handleMenuItemClick('/accountInfo')}>계정 설정</MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('/portfolio')}>포트폴리오 정보</MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('/friends')}>친구 목록</MenuItem>
                        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                    </StyledMenu>
                </Box>
            </header>
            <Tabs value={value} onChange={handleChange} textColor="inherit" indicatorColor="secondary" style={{backgroundColor: '#f0f0f0'}}>
                <Tab label="홈" onClick={() => handleMenuItemClick('/main')}/>
                <Tab label="자기소개서" onClick={() => handleMenuItemClick('/coverLetter')}/>
                <Tab label="포트폴리오" onClick={() => handleMenuItemClick('/selfIntroduction')}/>
                <Tab label="프로젝트" onClick={() => handleMenuItemClick('')}/>
                <Tab
                    label="사용 기술"
                    onClick={openSkillMenu}
                    aria-controls="skills-menu"
                    aria-haspopup="true"
                />
                <Tab label="내 문서" onClick={() => handleMenuItemClick('')}/>
                <Tab label="커뮤니티" onClick={() => handleMenuItemClick('')}/>
                <Tab label="테스트" onClick={() => handleMenuItemClick('/testpage')}/>
            </Tabs>
            <StyledMenu
                id="skills-menu"
                anchorEl={skillMenuAnchorEl}
                open={Boolean(skillMenuAnchorEl)}
                onClose={() => setSkillMenuAnchorEl(null)}
            >
                <MenuItem onClick={() => closeSkillMenu('/frontend')}>프론트엔드</MenuItem>
                <MenuItem onClick={() => closeSkillMenu('/backend')}>백엔드</MenuItem>
                <MenuItem onClick={() => closeSkillMenu('/codeedit')}>테스트코드편집</MenuItem>
                <MenuItem onClick={() => closeSkillMenu('/codeview')}>테스트코드보기</MenuItem>
            </StyledMenu>
        </div>
    );
};

export default HeaderLayout;
