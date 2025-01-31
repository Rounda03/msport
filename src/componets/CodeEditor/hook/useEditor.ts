import {UseDependencyType} from "./useDependency";
import {UseFileType} from "./useFile";
import {UseCodeEditorType} from "./useCodeEditor";
import Bundler, {ImportMap} from "../esbuild/EsbuildSystem";
import {useContext} from "react";
import EditorContext from "../context/EditorContext";

export interface UseEditorType {
    useDependency: UseDependencyType;
    useFile: UseFileType;
    useCodeEditor: UseCodeEditorType;
    transformedCode: string;
    bundler: Bundler;
    build: (callback?: (result: string) => void) => Promise<void>;
    saveCode: (pathName: string, code: string) => void;
    addFile: (fileName: string, code: string) => void;
    updateFile: (fileName: string, code: string) => void;
    removeFile: (fileName: string) => void;
    addDependency: (dependencyName: string, root: string) => void;
    removeDependency: (dependencyName: string) => void;
    resetDependency: () => void;
    readDependency: () => {
        bundlerImportMap: ImportMap,
        dependency: { dependency: string[], importMap: { imports: Record<string, string> } }
    };
}

const useEditor = (): UseEditorType => {
    const value = useContext(EditorContext);
    if (!value) {
        throw new Error('useEditor must be used within a EditorProvider');
    }

    const {useDependency, useCodeEditor, useFile, bundler, transformedCode, build, saveCode} = value;

    const fileNameCheck = (fileName: string) => {
        if (fileName === 'index.tsx') return fileName;
        if (fileName.startsWith('/')) return fileName;
        return `/${fileName}`;
    }

    const addFile = (fileName: string, code: string) => {
        if (!fileName) return;
        const addFileName = fileNameCheck(fileName);
        bundler.addFile(addFileName, code);
        useFile.addNewFile(addFileName, code);
    }
    const updateFile = (fileName: string, code: string) => {
        if (!fileName) return;
        const updateFileName = fileNameCheck(fileName);
        bundler.addFile(updateFileName, code);
        useFile.updateFile(updateFileName, code);
    }
    const removeFile = (fileName: string) => {
        if (!fileName) return;
        const removeFileName = fileNameCheck(fileName);
        bundler.removeFile(removeFileName);
        useFile.removeFile(removeFileName);
    }

    const addDependency = (dependencyName: string, root: string) => {
        bundler.addDependency(dependencyName, root);
        useDependency.addDependency(dependencyName);
    }
    const removeDependency = (dependencyName: string) => {
        bundler.removeDependency(dependencyName);
        useDependency.removeDependency(dependencyName);
    }
    const resetDependency = () => {
        bundler.resetDependency();
        useDependency.resetDependency();
    }
    const readDependency = () => {
        return {
            bundlerImportMap: bundler.getDependencies(),
            dependency: useDependency.readDependency(),
        }
    }

    return {
        useDependency,
        useFile,
        useCodeEditor,
        transformedCode,
        bundler,
        build,
        saveCode,
        addFile,
        updateFile,
        removeFile,
        addDependency,
        removeDependency,
        resetDependency,
        readDependency,
    };
}
export default useEditor;