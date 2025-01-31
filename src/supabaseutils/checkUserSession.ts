import supabase from "../supabaseClient";

export const checkUserSession = async () => {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        alert('로그인이 필요합니다.');
        throw new Error('사용자가 인증되지 않았습니다.');
    }

    return session;
};