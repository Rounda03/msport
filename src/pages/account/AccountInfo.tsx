import React, { useState } from 'react';
import {
    Box, Typography, Avatar, Paper, Grid, Button, Divider, TextField,
    Tabs, Tab, Switch, List, ListItem, ListItemText, ListItemSecondaryAction,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { User } from "@supabase/supabase-js";
import supabase from "../../supabaseClient";

interface AccountInfoProps {
    userData?: User;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ userData }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [openPhoneDialog, setOpenPhoneDialog] = useState(false);
    const [openNicknameDialog, setOpenNicknameDialog] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [openSecurityCheckDialog, setOpenSecurityCheckDialog] = useState(false);
    const [userInfo, setUserInfo] = useState({
        nickname: userData?.user_metadata.nickname || '',
        phone: userData?.user_metadata.phone || '',
    });
    const [newNickname, setNewNickname] = useState('');
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue === 1 && !openSecurityCheckDialog) {
            setOpenSecurityCheckDialog(true);
        } else {
            setActiveTab(newValue);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };
    const checkNicknameDuplicate = async () => {
        try {
            const { data, error } = await supabase
                .rpc('check_nickname_exists', { nickname: newNickname });

            if (error) {
                throw error;
            }

            if (data) {
                alert('이미 사용 중인 닉네임입니다.');
                setIsNicknameChecked(false);
                return false;
            } else {
                alert('사용 가능한 닉네임입니다.');
                setIsNicknameChecked(true);
                return true;
            }
        } catch (error) {
            console.error('닉네임 중복 확인 중 오류 발생:', error);
            alert('닉네임 중복 확인 중 오류가 발생했습니다.');
            return false;
        }
    };

    const onNickChangeConfirm = async (nickname: string) => {
        // supabase 닉네임변경로직
        const { data, error } = await supabase.auth.updateUser({
            data: { nickname: nickname } // 새로운 닉네임으로 업데이트
        });
        //닉네임부분만 상태 업데이트///////////////////
        setUserInfo(prevState => ({
            ...prevState,
            nickname: nickname
        }));
        if (error) {
            console.error('사용자 정보 업데이트 실패:', error);
        } else {
            console.log('사용자 정보 업데이트 성공:', data);
        }
    };
    const handleNickNameConfirm = () => {
        if (isNicknameChecked) {
            onNickChangeConfirm(newNickname);
            setOpenNicknameDialog(false)
        }
    };
    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNickname(e.target.value);
        setIsNicknameChecked(false);
    };
    const handlePhoneChange = () => {
        setOpenPhoneDialog(true);
    };


    const handlePasswordChange = () => {
        setOpenPasswordDialog(true);
    };

    const handleSecurityCheck = () => {
        setOpenSecurityCheckDialog(false);
        setActiveTab(1);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, m: 2 }}>
            <Grid container spacing={3} alignItems="center" mb={3}>
                <Grid item>
                    <Avatar
                        src={userData?.user_metadata.avatar_url}
                        alt={userData?.user_metadata.nickname || userData?.email}
                        sx={{ width: 100, height: 100 }}
                    />
                    <Button size="small" sx={{ mt: 1 }}>프로필 사진 변경</Button>
                </Grid>
                <Grid item xs>
                    <Typography variant="h4">{userInfo.nickname || userData?.email}</Typography>
                    <Typography variant="body1">{userData?.email}</Typography>
                    <Typography variant="body2">
                        가입일: {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : '정보 없음'}
                    </Typography>
                </Grid>
            </Grid>

            <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="개인 정보" />
                <Tab label="보안" />
            </Tabs>

            <Box mt={3}>
                {activeTab === 0 && (
                    <Box>
                        <Typography variant="h6" mb={2}>개인 정보</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="이름"
                                    value={userData?.user_metadata.name || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="이메일"
                                    value={userData?.email || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} container alignItems="center">
                                <Grid item xs>
                                    <TextField
                                        fullWidth
                                        label="닉네임"
                                        name="nickname"
                                        value={userInfo.nickname}
                                        disabled
                                    />
                                </Grid>
                                <Grid item>
                                    <Button onClick={()=>setOpenNicknameDialog(true)} sx={{ ml: 2 }}>변경</Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container alignItems="center">
                                <Grid item xs>
                                    <TextField
                                        fullWidth
                                        label="전화번호"
                                        name="phone"
                                        value={userInfo.phone}
                                        disabled
                                    />
                                </Grid>
                                <Grid item>
                                    <Button onClick={handlePhoneChange} sx={{ ml: 2 }}>변경</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {activeTab === 1 && (
                    <Box>
                        <Typography variant="h6" mb={2}>보안 설정</Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="비밀번호 변경" />
                                <ListItemSecondaryAction>
                                    <Button variant="outlined" onClick={handlePasswordChange}>변경</Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="2단계 인증" secondary="계정 보안을 강화합니다" />
                                <ListItemSecondaryAction>
                                    <Switch />
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </Box>
                )}
            </Box>

            <Dialog open={openPhoneDialog} onClose={() => setOpenPhoneDialog(false)}>
                <DialogTitle>전화번호 변경</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="새 전화번호"
                        type="tel"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPhoneDialog(false)}>취소</Button>
                    <Button onClick={() => setOpenPhoneDialog(false)}>확인</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openNicknameDialog} onClose={() => setOpenNicknameDialog(false)}>
                <DialogTitle>닉네임 변경</DialogTitle>
                <DialogContent>
                    <Box display="flex" alignItems="flex-end">
                        <TextField
                            autoFocus
                            margin="dense"
                            label="새 닉네임"
                            fullWidth
                            variant="standard"
                            value={newNickname}
                            onChange={handleNicknameChange}
                        />
                        <Button onClick={()=>checkNicknameDuplicate()} disabled={!newNickname}>
                            중복 확인
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNicknameDialog(false)}>취소</Button>
                    <Button onClick={handleNickNameConfirm} disabled={!isNicknameChecked}>
                        확인
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
                <DialogTitle>비밀번호 변경</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="현재 비밀번호"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="새 비밀번호"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="새 비밀번호 확인"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPasswordDialog(false)}>취소</Button>
                    <Button onClick={() => setOpenPasswordDialog(false)}>변경</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openSecurityCheckDialog} onClose={() => setOpenSecurityCheckDialog(false)}>
                <DialogTitle>보안 확인</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="현재 비밀번호"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSecurityCheckDialog(false)}>취소</Button>
                    <Button onClick={handleSecurityCheck}>확인</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AccountInfo;
