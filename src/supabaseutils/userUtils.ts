import supabase  from '../supabaseClient'; // supabase 클라이언트 import 경로 조정 필요

export const checkNicknameDuplicate = async (newNickname: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .rpc('check_nickname_exists', { nickname: newNickname });

        if (error) {
            throw error;
        }

        if (data) {
            alert('이미 사용 중인 닉네임입니다.');
            return true;
        } else {
            alert('사용 가능한 닉네임입니다.');
            return false;
        }
    } catch (error) {
        console.error('닉네임 중복 확인 중 오류 발생:', error);
        alert('닉네임 중복 확인 중 오류가 발생했습니다.');
        return false;
    }
};

export const checkEmailDuplicate = async (newEmail: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .rpc('check_email_exists', { email: newEmail });

        if (error) {
            throw error;
        }

        if (data) {
            alert('이미 사용 중인 이메일입니다.');
            return false;
        } else {
            alert('사용 가능한 이메일입니다.');
            return true;
        }
    } catch (error) {
        console.error('이메일 중복 확인 중 오류 발생:', error);
        alert('이메일 중복 확인 중 오류가 발생했습니다.');
        return false;
    }
}