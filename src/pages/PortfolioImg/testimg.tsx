import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';

const Testimg: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [pdfs, setPdfs] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // 파일 이름 공백 제거
    const sanitizeFileName = (name: string): string => {
        return name.replace(/[^a-zA-Z0-9.\-_]/g, '_'); // 공백과 특수 문자를 '_'로 대체
    };

    // 사용자 인증 확인
    const checkUserSession = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            alert('로그인이 필요합니다.');
            throw new Error('사용자가 인증되지 않았습니다.');
        }

        return session;
    };

    // 이미지 업로드 핸들러
    const handleUpload = async (filetype : string) => {
        try {
            // 사용자 인증 확인
            const session = await checkUserSession();
            const userId = session.user.id; // 현재 사용자 ID 가져오기

            if (!file) return alert('파일을 선택하세요.');

            setLoading(true);
            const sanitizedFileName = sanitizeFileName(file.name);
            const filePath = `uploads/${userId}/${filetype}/${sanitizedFileName}`; // 사용자 ID를 경로에 포함

            const { error } = await supabase.storage
                .from('portfolioST')
                .upload(filePath, file);

            if (error) {
                console.error('업로드 실패:', error.message);
                alert('업로드에 실패했습니다.');
            } else {
                alert('업로드 성공!');
                fetchImages('img'); // 업로드 후 이미지 목록 갱신
            }
        } catch (error: any) {
            console.error('업로드 중 오류:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // 이미지 목록 가져오기 (사용자별)
    const fetchImages = async (filetype : string) => {
        try {
            // 사용자 인증 확인
            const session = await checkUserSession();
            const userId = session.user.id; // 현재 사용자 ID 가져오기

            if (!userId) return;

            const {data: files, error} = await supabase.storage
                .from('portfolioST')
                .list(`uploads/${userId}/${filetype}`, {limit: 100}); // 사용자 폴더 내 이미지만 가져오기

            if (error) {
                console.error('파일 목록 가져오기 실패:', error.message);
            } else {
                const imageUrls = await Promise.all(
                    files?.map(async (file) => {
                        const {data, error} = await supabase.storage
                            .from('portfolioST')
                            .createSignedUrl(`uploads/${userId}/${filetype}/${file.name}`, 3600); // 사용자 폴더 내 파일에 대한 Signed URL 생성

                        if (error) {
                            console.error(`Signed URL 생성 실패: ${error.message}`);
                            return '';
                        }
                        return data?.signedUrl || '';
                    }) || []
                );

                setImages(imageUrls);
            }
        } catch (error: any) {
            console.error('파일 목록 로드 중 오류:', error.message);
        }
    };
    // pdf 목록 가져오기 (사용자별)
    const fetchPdfs = async (filetype : string) => {
        try {
            // 사용자 인증 확인
            const session = await checkUserSession();
            const userId = session.user.id; // 현재 사용자 ID 가져오기

            if (!userId) return;

            const {data: files, error} = await supabase.storage
                .from('portfolioST')
                .list(`uploads/${userId}/${filetype}`, {limit: 100}); // 사용자 폴더 내 이미지만 가져오기

            if (error) {
                console.error('파일 목록 가져오기 실패:', error.message);
            } else {
                const imageUrls = await Promise.all(
                    files?.map(async (file) => {
                        const {data, error} = await supabase.storage
                            .from('portfolioST')
                            .createSignedUrl(`uploads/${userId}/${filetype}/${file.name}`, 3600); // 사용자 폴더 내 파일에 대한 Signed URL 생성

                        if (error) {
                            console.error(`Signed URL 생성 실패: ${error.message}`);
                            return '';
                        }
                        return data?.signedUrl || '';
                    }) || []
                );

                setPdfs(imageUrls);
            }
        } catch (error: any) {
            console.error('파일 목록 로드 중 오류:', error.message);
        }
    };

    // 파일 선택 핸들러
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    useEffect(() => {
        fetchImages('img'); // 초기 이미지 목록 로드
        fetchPdfs('portfoliopdf');
    }, []);

    return (
        <div style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
            <h1>이미지 업로드</h1>
            <input
                type="file"
                accept="image/*" //accept="image/*,application/pdf" // 이미지와 PDF 파일 모두 허용
                onChange={handleFileChange}
                disabled={loading}
            />
            <button onClick={() => handleUpload('img')} disabled={loading || !file}>
                {loading ? '업로드 중...' : '이미지 업로드'}
            </button>
            <hr/>
            <h2>등록된 이미지</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                {images.length > 0 ? (
                    images.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`이미지 ${index + 1}`}
                            style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                            }}
                        />
                    ))
                ) : (
                    <p>등록된 이미지가 없습니다.</p>
                )}
            </div>
            <h1>pdf 업로드</h1>
            <input
                type="file"
                accept="image/*,application/pdf" // 이미지와 PDF 파일 모두 허용
                onChange={handleFileChange}
                disabled={loading}
            />
            <button onClick={() => handleUpload('portfoliopdf')} disabled={loading || !file}>
                {loading ? '업로드 중...' : '이미지 업로드'}
            </button>
            <hr/>
            <h2>등록된 pdf</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                {pdfs.length > 0 ? (
                    pdfs.map((url, index) => (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            PDF 파일 {index + 1}
                        </a>
                    ))
                ) : (
                    <p>등록된 pdf가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default Testimg;
