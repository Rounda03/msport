import React, {useEffect, useState} from 'react';
import {
    Box, Typography, Avatar, Paper, Grid, Button, Divider, TextField,
    Tabs, Tab, Switch, List, ListItem, ListItemText, ListItemSecondaryAction,
    Dialog, DialogTitle, DialogContent, DialogActions, ToggleButtonGroup, ToggleButton, FormControlLabel
} from '@mui/material';
import { User } from "@supabase/supabase-js";
import supabase from "../../supabaseClient";
import { checkNicknameDuplicate } from '../../supabaseutils/userUtils';

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
        geusttoken: userData?.user_metadata.guest_token || '',
        invite_yn: '',
        chat_yn: true
    });
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [openSwitchDialog, setOpenSwitchDialog] = useState(false);
    const [switchType, setSwitchType] = useState('');

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
    const handleCheckNickname = async () => {

        const isAvailable = await checkNicknameDuplicate(newNickname);
        setIsNicknameChecked(isAvailable);
        if (isAvailable) {
                        setIsNicknameChecked(false);
                        return false;
                    } else {
                        setIsNicknameChecked(true);
                        return true;
                    }
    };

    // const checkNicknameDuplicate = async () => {
    //     try {
    //         const { data, error } = await supabase
    //             .rpc('check_nickname_exists', { nickname: newNickname });
    //
    //         if (error) {
    //             throw error;
    //         }
    //
    //         if (data) {
    //             alert('이미 사용 중인 닉네임입니다.');
    //             setIsNicknameChecked(false);
    //             return false;
    //         } else {
    //             alert('사용 가능한 닉네임입니다.');
    //             setIsNicknameChecked(true);
    //             return true;
    //         }
    //     } catch (error) {
    //         console.error('닉네임 중복 확인 중 오류 발생:', error);
    //         alert('닉네임 중복 확인 중 오류가 발생했습니다.');
    //         return false;
    //     }
    // };
    //게스트토큰발급
    const duplicateCheckToken = async (token: String):Promise<boolean> => {
        const { data, error } = await supabase.rpc('check_guest_token_exists', { token: token });
        return data;
    }
    const generateGuestToken = async (): Promise<string> => {

        let token = Math.random().toString(36).substring(2, 10);
        console.log('게스트토큰발급',token);

        if(await duplicateCheckToken(token)){
            alert('게스트토큰이 중복되었습니다. 다시 발급하십시오.');
        }

        // Update the user's guest_token in the database
        const { data , error} = await supabase.auth.updateUser({
            data: { guest_token: token }
        });
        setUserInfo(prevState => ({
            ...prevState,
            guesttoken: token
        }));
        if (error) throw error;

        return token;
    };

    const onNickChangeConfirm = async (nickname: string) => {
        // supabase 닉네임변경로직
        try {
            // profiles 테이블 업데이트
            const { data: profileData, error: profileError } = await supabase
                .from('user_profiles')
                .update({ nickname: nickname })
                .eq('email', userData?.email);

            if (profileError) throw profileError;
            //
            // // auth.users 메타데이터 업데이트
            // const { data: authData, error: authError } = await supabase.auth.updateUser({
            //     data: { nickname: nickname }
            // });
            //
            // if (authError) throw authError;

            // 상태 업데이트
            setUserInfo(prevState => ({
                ...prevState,
                nickname: nickname
            }));

            console.log('사용자 정보 업데이트 성공');
        } catch (error) {
            console.error('사용자 정보 업데이트 실패:', error);
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
    const handlePhoneChange = async () => {
        try {
            const { data, error } = await supabase.auth.updateUser({
                phone: newPhoneNumber
            });

            if (error) throw error;

            setUserInfo(prevState => ({
                ...prevState,
                phone: newPhoneNumber
            }));
            alert('전화번호가 성공적으로 변경되었습니다.');
            setOpenPhoneDialog(false);
            setNewPhoneNumber('');
        } catch (error) {
            console.error('전화번호 변경 중 오류 발생:', error);
            alert('전화번호 변경에 실패했습니다.');
        }
    };


    const handlePasswordChange = async () => {
        if (currentPassword !== userData?.user_metadata.password) {
            alert('기존 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            alert('비밀번호가 성공적으로 변경되었습니다.');
            setOpenPasswordDialog(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error('비밀번호 변경 중 오류 발생:', error);
            alert('비밀번호 변경에 실패했습니다.');
        }
    };

    const handleSecurityCheck = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: userData?.email || '',
                password: password
            });

            if (error) {
                throw error;
            }

            // If successful, close the dialog and switch to the security tab
            setOpenSecurityCheckDialog(false);
            setActiveTab(1);
        } catch (error) {
            console.error('비밀번호 확인 중 오류 발생:', error);
            alert('비밀번호가 올바르지 않습니다.');
        }
    };
    //userinfo.id로 user_profiles 테이블에서 사용자 정보를 가져옴
    const fetchUserInfo = async () => {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('invite_yn, chat_yn')
            .eq('email', userData?.email)
            .single();

        if (error) {
            console.error('Error fetching user info:', error);
            return;
        }

        if (data) {
            setUserInfo(prevState => ({
                ...prevState,
                invite_yn: data.invite_yn,
                chat_yn: data.chat_yn
            }));
        }
    };
    useEffect(() => {
        //userinfo.id로 user_profiles 테이블에서 사용자 정보를 가져옴
        fetchUserInfo();
    }, []);

    const handleSwitchChange = async (type: 'invitesyn' | 'chatyn') => {
        // 스위치 상태를 변경한 후 확인 팝업 띄우기
        setSwitchType(type);
        setOpenSwitchDialog(true);
    };
    const handleSwitchConfirmChange = async () => {
        // 확인 버튼 클릭 시, 조건에 맞게 프로필 업데이트

                // 조건에 맞게 값 변경
        if (switchType === 'invitesyn') {
            // 테이블 업데이트
            const { data, error } = await supabase
                .from('user_profiles')
                .update({ invite_yn: userInfo.invite_yn === 'Y' ? 'N' : 'Y' })
                .eq('email', userData?.email);

            if (error) {
                console.error(error.message);
            } else {
                // 상태 변경 후 스위치 값 업데이트
                setUserInfo(prevState => ({
                    ...prevState,
                    invite_yn: userInfo.invite_yn === 'Y' ? 'N' : 'Y',
                }));
            }

        } else if (switchType === 'chatyn') {

            // 테이블 업데이트
            const { data, error } = await supabase
                .from('user_profiles')
                .update({ chat_yn: !userInfo.chat_yn })
                .eq('email', userData?.email);

            if (error) {
                console.error(error.message);
            } else {
                // 상태 변경 후 스위치 값 업데이트
                setUserInfo(prevState => ({
                    ...prevState,
                    chat_yn: !userInfo.chat_yn,
                }));
            }

        }

        // 팝업 닫기
        setOpenSwitchDialog(false);
    };
    const handleCancelChange = () => {
        setOpenSwitchDialog(false);
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
                    <Typography variant="h4">{userInfo?.nickname || userData?.user_metadata.name}</Typography>
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
                            {/* 친구 초대 여부 */}
                            <Grid item xs={12}>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={userInfo.invite_yn === 'Y'}
                                                color="primary"
                                                sx={{
                                                    width: 150,  // 스위치의 전체 길이를 크게 설정
                                                    height: 50,  // 높이를 설정
                                                    '& .MuiSwitch-thumb': {
                                                        width: 40,  // thumb의 크기 설정
                                                        height: 40, // thumb의 높이 설정
                                                    },
                                                    '& .MuiSwitch-track': {
                                                        borderRadius: 30,  // 트랙의 둥글기 설정
                                                        backgroundColor: '#BEBEBE',  // 트랙의 색상 설정
                                                    },
                                                    '& .MuiSwitch-switchBase': {
                                                        padding: 1,  // thumb의 이동 범위 설정
                                                        '&.Mui-checked': {
                                                            transform: 'translateX(100px)',  // checked 상태에서의 이동 범위 조정
                                                        },
                                                        '&.MuiSwitch-switchBase': {
                                                            transition: 'transform 0.3s ease',  // 부드러운 이동 애니메이션 추가
                                                        }
                                                    },
                                                }}
                                            />
                                        }
                                        label="친구 초대 여부"
                                        labelPlacement="start"
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }}
                                        onChange={() => handleSwitchChange('invitesyn')}
                                    />
                                </Grid>
                            </Grid>
                            {/* 채팅 초대 여부 */}
                            <Grid item xs={12}>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                               checked={userInfo.chat_yn}
                                               onChange={() => handleSwitchChange('chatyn')}
                                               color="primary"
                                                sx={{
                                                    width: 150,  // 스위치의 전체 길이를 크게 설정
                                                    height: 50,  // 높이를 설정
                                                    '& .MuiSwitch-thumb': {
                                                        width: 40,  // thumb의 크기 설정
                                                        height: 40, // thumb의 높이 설정
                                                    },
                                                    '& .MuiSwitch-track': {
                                                        borderRadius: 30,  // 트랙의 둥글기 설정
                                                        backgroundColor: '#BEBEBE',  // 트랙의 색상 설정
                                                    },
                                                    '& .MuiSwitch-switchBase': {
                                                        padding: 1,  // thumb의 이동 범위 설정
                                                        '&.Mui-checked': {
                                                            transform: 'translateX(100px)',  // checked 상태에서의 이동 범위 조정
                                                        },
                                                        '&.MuiSwitch-switchBase': {
                                                            transition: 'transform 0.3s ease',  // 부드러운 이동 애니메이션 추가
                                                        }
                                                    },
                                                }}
                                            />
                                        }
                                        label="채팅 초대 여부"
                                        labelPlacement="start"
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }}
                                    />
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
                                    <Button variant="outlined" onClick={()=>setOpenPasswordDialog(true)}>변경</Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="2단계 인증" secondary="계정 보안을 강화합니다" />
                                <ListItemSecondaryAction>
                                    <Switch />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="게스트 토큰" secondary={userData?.user_metadata.guest_token} />
                                <ListItemSecondaryAction>
                                    <Button
                                        variant="outlined"
                                        onClick={() => generateGuestToken()}
                                    >
                                        {userData?.user_metadata?.guest_token ? "재발급" : "발급"}
                                    </Button>
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
                        onChange={(e) => setNewPhoneNumber(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPhoneDialog(false)}>취소</Button>
                    <Button onClick={() => handlePhoneChange()}>확인</Button>
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
                        <Button onClick={()=>handleCheckNickname()} disabled={!newNickname}>
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
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="새 비밀번호"
                        type="password"
                        fullWidth
                        onChange={(e) => setNewPassword(e.target.value)}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="새 비밀번호 확인"
                        type="password"
                        fullWidth
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPasswordDialog(false)}>취소</Button>
                    <Button onClick={() => handlePasswordChange()}>변경</Button>
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
                        onChange={(e) => setPassword(e.target.value)}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSecurityCheckDialog(false)}>취소</Button>
                    <Button onClick={handleSecurityCheck}>확인</Button>
                </DialogActions>
            </Dialog>
            {/* 확인 팝업 */}
            <Dialog open={openSwitchDialog} onClose={handleCancelChange}>
                <DialogTitle>변경하시겠습니까?</DialogTitle>
                <DialogContent>
                    <p>설정 변경 후 반영됩니다. 변경하시겠습니까?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelChange} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleSwitchConfirmChange} color="primary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AccountInfo;
