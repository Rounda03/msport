import Editor from "@monaco-editor/react";
import React, {useEffect} from "react";
import * as monaco from "monaco-editor";
import useEditor from "./hook/useEditor";

interface Props {
    width?: string | number;
    height?: string | number;
}

const CodeEditor: React.FC<Props> = ({width, height}) => {

    const {useCodeEditor, useFile, bundler, build, updateFile} = useEditor();
    const {editorRef, loading, handleEditorWillMount, handleEditorDidMount, handleCodeChange, getCode} = useCodeEditor;
    const {file} = useFile;
    const testButton = () => {
        // setCode(`console.log('test')`);
        console.log('test: ', bundler.readFile());
    }

    useEffect(() => {
        if (!editorRef.current) return;
        if (!file) return;
        handleCodeChange(file.code);
        editorRef.current?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            updateFile(file.fileName, getCode() || '');
        });
        editorRef.current?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            updateFile(file.fileName, getCode() || '');
            build().then(() => console.log('build success'));
        });
    }, [file, loading]);
    return (
        <div>
            <div style={{display: 'flex'}}>
                <div style={{display: file ? 'block' : 'none'}}>
                    <Editor
                        height={height}
                        width={width}
                        defaultLanguage="typescript"
                        language={'typescript'}
                        defaultValue={file?.code}
                        beforeMount={handleEditorWillMount}
                        onMount={handleEditorDidMount}
                    />
                </div>
                {!file && (
                    <div style={{width: width, height: height}}>
                        <h1>파일목록에서 <br/>파일을 선택해주세요</h1>
                    </div>
                )}
            </div>
            <div>
                <button onClick={() => testButton()}>
                    test
                </button>
                <button onClick={() => console.log(file)}>
                    콘솔
                </button>
            </div>
        </div>
    );
}

export default React.memo(CodeEditor);