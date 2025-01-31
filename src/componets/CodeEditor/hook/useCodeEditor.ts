import {Monaco, OnMount} from "@monaco-editor/react";
import {useRef} from "react";
import * as monaco from "monaco-editor";

export interface UseCodeEditorType {
    handleEditorWillMount: (monaco: Monaco) => void;
    handleEditorDidMount: (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void;
    getCode: () => (string | undefined);
    handleCodeChange: (newCode: string) => void;
    editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | undefined>;
}

const useCodeEditor = (): UseCodeEditorType => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

    const handleCodeChange = (newCode: string) => {
        if (!editorRef.current) return;
        editorRef.current.setValue(newCode);
    }
    const handleEditorWillMount = (monaco: Monaco) => {    // monaco editor 설정
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.React,
            jsxFactory: 'React.createElement',
            reactNamespace: 'React',
            allowNonTsExtensions: true,
            allowJs: true,
            target: monaco.languages.typescript.ScriptTarget.Latest
        });
    }
    const handleEditorDidMount: OnMount = (editor) => {   // monaco editor 값 가져올수 있게
        editorRef.current = editor;
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
            () => {
            })
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
            () => {
            })
    }
    const getCode = () => {
        if (!editorRef.current) return '';
        return editorRef.current?.getValue();
    }

    return {handleEditorWillMount, handleEditorDidMount, getCode,  handleCodeChange, editorRef};
}

export default useCodeEditor;