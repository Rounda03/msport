import React, {useState} from "react";
import useEditor from "./hook/useEditor";

const FileList = () => {
    const [pathName, setPathName] = useState<string>('');
    const {useCodeEditor, useFile, addFile,updateFile} = useEditor();
    const {getCode} = useCodeEditor;
    const {selectFile, file, fileList,} = useFile;

    return (
        <div>
            <h2>FileList</h2>
            {/*<button onClick={onClick}>코드 저장</button>*/}
            <button onClick={() => {
                if (!file) {
                    alert('파일을 선택해주세요');
                    return;
                }
                updateFile(file.fileName, getCode() || '');
            }}>현재 코드 저장
            </button>
            <div>
                <input type={'text'} placeholder={'pathName'} onChange={(e) => setPathName(e.target.value)}/>
                <button onClick={() => {
                    if (!pathName) {
                        alert('파일명을 입력해주세요');
                        return;
                    }
                    addFile(`/${pathName}`, '');
                }}>파일추가
                </button>
                {/*<button onClick={()=> {*/}
                {/*    console.log('pathName',pathName);*/}
                {/*    saveCode(pathName, '')*/}
                {/*}}>파일추가</button>*/}
            </div>
            <div>
                <h2>파일 목록</h2>
                {fileList.map((value, index) => {
                    return (
                        <div key={index} onClick={() => selectFile(value.fileName)}>
                            <h3>{value.fileName}</h3>
                        </div>
                    )
                })
                }
            </div>
            <button onClick={() => console.log(fileList)}>fileList 콘솔</button>
            <button onClick={() => console.log(file)}>selectFile 콘솔</button>
        </div>
    );
};
export default React.memo(FileList);