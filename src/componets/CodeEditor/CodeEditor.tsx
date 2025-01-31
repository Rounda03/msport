import Editor from "@monaco-editor/react";
import React, {useEffect} from "react";
import * as monaco from "monaco-editor";
import useEditor from "./hook/useEditor";


const CodeEditor: React.FC = () => {

    const {useCodeEditor, useFile, bundler, build, updateFile} = useEditor();
    const {editorRef, handleEditorWillMount, handleEditorDidMount, handleCodeChange, getCode} = useCodeEditor;
    const {selectedFile} = useFile;
    const testButton = () => {
        // setCode(`console.log('test')`);
        console.log('test: ', bundler.readFile());
    }

    useEffect(() => {
        if (!selectedFile) return;
        handleCodeChange(selectedFile.code);
        editorRef.current?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            updateFile(selectedFile.fileName, getCode() || '');
        });
        editorRef.current?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            updateFile(selectedFile.fileName, getCode() || '');
            build();
        });
    }, [selectedFile]);
    return (
        <div>
            <div style={{display: 'flex'}}>
                {selectedFile ? <Editor
                    height="70vh"
                    width={"50vw"}
                    defaultLanguage="typescript"
                    defaultValue={selectedFile.code}
                    beforeMount={handleEditorWillMount}
                    onMount={handleEditorDidMount}
                /> : (
                    <div style={{width: '50vw', height: '70vh',}}>
                        <h1>파일목록에서 <br/>파일을 선택해주세요</h1>
                    </div>
                )}

            </div>
            <div>
                <button onClick={() => testButton()}>
                    test
                </button>
                <button onClick={() => console.log(selectedFile)}>
                    콘솔
                </button>
            </div>
        </div>
    );
}

export default CodeEditor;