import {useRef, useState} from "react";

interface File {
    fileName: string;
    code: string;
}

export interface UseFileType {
    fileList: File[];
    file: File | undefined;
    fileRef?: React.MutableRefObject<File | undefined>;
    selectFile: (fileName: string) => void;
    mountSetFileList: (fileList: Map<string, string>) => void;
    addNewFile: (fileName: string, code: string) => void;
    updateFile: (fileName: string, code: string) => void;
    removeFile: (fileName: string) => void;
}

const useFile = (): UseFileType => {

    const [fileList, setFileList] = useState<File[]>([]);
    const [file, setFile] = useState<File>();
    const fileRef = useRef<File>();
    const selectFile = (fileName: string) => {
        const file = fileList.find((file) => file.fileName === fileName);
        setFile(file);
        fileRef.current = file;
    }
    const addNewFile = (fileName: string, code: string) => {
        if (!fileName) return;
        if (fileList.find((file) => file.fileName === fileName)) {
            console.error('이미 존재하는 파일명입니다.');
            return;
        }
        setFileList((prev) => [...prev, {fileName, code}]);
    }
    const updateFile = (fileName: string, code: string) => {
        if (!fileName) return;
        const newFileList = fileList.map((file) => {
            if (file.fileName === fileName) {
                return {fileName, code};
            }
            return file;
        });
        setFileList(newFileList);
    }
    const removeFile = (fileName: string) => {
        if (!fileName) return;
        const newFileList = fileList.filter((file) => file.fileName !== fileName);
        setFileList(newFileList);
    }
    const mountSetFileList = (fileList: Map<string, string>) => {
        if (!fileList) return;
        const newFileList: { fileName: string, code: string }[] = [];
        fileList?.forEach((value, key) => {
            newFileList.push({fileName: key, code: value});
        });
        setFileList(newFileList);
    }

    return {
        fileList,
        file,
        fileRef,
        selectFile,
        mountSetFileList,
        addNewFile,
        updateFile,
        removeFile
    }
}

export default useFile;