import supabase from "../../supabaseClient";
import { User } from "@supabase/supabase-js";

export const subscribeToMessages = (chatRoomId: number, callback: (payload: any) => void) => {
    return supabase
        .channel(`messages-${chatRoomId}`)
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_room_id=eq.${chatRoomId}` },
            callback
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log('Subscribed to messages channel');
            } else if (status === 'CHANNEL_ERROR') {
                console.error('Failed to subscribe to messages channel');
            }
        });
};

export const createChatRoom = async (userinfo: User, participantIds: string[]) => {
    try {
        // 참가자들의 닉네임 가져오기
        const { data: participants, error: participantsError } = await supabase
            .from('user_profiles')
            .select('user_id, nickname')
            .in('user_id', [userinfo.id, ...participantIds]);

        if (participantsError) throw participantsError;

        // 채팅방 이름 생성
        const roomName = participants
            .map(p => p.nickname)
            .sort()
            .join(', ') + '의 채팅방';

        // 1:1 채팅인 경우 기존 채팅방 확인
        if (participantIds.length === 1) {
            const { data: existingRoom } = await supabase
                .from('chat_rooms')
                .select('id')
                .eq('is_group', false)
                .eq('name', roomName)
                .single();

            if (existingRoom) return existingRoom;
        }

        // 새 채팅방 생성
        const { data: chatRoom, error: chatRoomError } = await supabase
            .from('chat_rooms')
            .insert({ name: roomName, is_group: participantIds.length > 1 })
            .select()
            .single();

        if (chatRoomError) throw chatRoomError;

        // 참가자 추가
        const members = participants.map(p => ({
            chat_room_id: chatRoom.id,
            user_id: p.user_id,
        }));

        const { error: membersError } = await supabase
            .from('chat_room_members')
            .insert(members);

        if (membersError) throw membersError;

        return chatRoom;
    } catch (error) {
        console.error('Error creating chat room:', error);
        throw error;
    }
};


export const sendMessage = async (userinfo: User, chatRoomId: number, content: string) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                chat_room_id: chatRoomId,
                user_id: userinfo.id,
                content,
                nickname: userinfo.user_metadata.nickname,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};
