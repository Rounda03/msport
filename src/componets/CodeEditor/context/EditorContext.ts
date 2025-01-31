import Bundler from "../esbuild/EsbuildSystem";
import {UseDependencyType} from "../hook/useDependency";
import {UseCodeEditorType} from "../hook/useCodeEditor";
import {UseFileType} from "../hook/useFile";
import {createContext} from "react";

interface EditorContextType {
    transformedCode: string;
    bundler: Bundler;
    build: (callback?: (result: string) => void) => Promise<void>;
    saveCode: (pathName: string, code: string) => void;
    useDependency: UseDependencyType;
    useCodeEditor: UseCodeEditorType;
    useFile: UseFileType;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export default EditorContext;