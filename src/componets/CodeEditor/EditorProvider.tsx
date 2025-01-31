import React, {useEffect, useRef, useState} from "react";
import Bundler, {defaultValue, initializeEsbuild} from "./esbuild/EsbuildSystem";
import useDependency from "./hook/useDependency";
import useCodeEditor from "./hook/useCodeEditor";
import useFile from "./hook/useFile";
import EditorContext from "./context/EditorContext";

interface Props {
    children: React.ReactNode;
    view?: boolean;
    codeData?: { pathName: string, code: string }[];
}

/** codeData 프롭으로 기본으로 파일 세팅 가능*/
const EditorProvider: React.FC<Props> = ({children, view = false, codeData}) => {

    const bundler = useRef(new Bundler()).current;
    const [transformedCode, setTransformedCode] = useState<string>('');
    const useDependency1 = useDependency();
    const useCodeEditor1 = useCodeEditor();
    const useFile1 = useFile();

    const build = async (callback?: (result: string) => void) => {
        await bundler.bundle('index.tsx').then((result) => {
            callback?.(result);
            setTransformedCode(result);
        });
    }

    const saveCode = (pathName: string, code: string) => {
        if (!bundler) return;
        if (!pathName) return;
        bundler.addFile(pathName, code);
    }

    useEffect(() => {
        /*  기본코드 bundler에 저장 */
        if (view && codeData) {//저장한 코드를 가져올때
            codeData.forEach(({pathName, code}) => {
                bundler.addFile(`/${pathName}`, code);
            })
        } else {//기본코드
            bundler.addFile('/App.tsx', defaultValue);
        }
        /*  기본코드 bundler에 저장 */

        /* 최초 마운틴시 esbuild세팅후 빌드실행  */
        const mounted = async () => {
            await initializeEsbuild();
            await build();
        }
        mounted().then(() => console.log('mounted'));
        /* 최초 마운틴시 esbuild세팅후 빌드실행  */

        /* bundler기준으로 각 state에 세팅 */
        useFile1.mountSetFileList(bundler.readFile());
        useDependency1.mountedSetImportMap(bundler.getDependencies().imports);
        /* bundler기준으로 각 state에 세팅  */

    }, []);

    const value = {
        useDependency:useDependency1,
        useCodeEditor:useCodeEditor1,
        useFile:useFile1,
        bundler,
        transformedCode,
        build,
        saveCode,
    }
    return (
        <EditorContext.Provider value={value}>
            {children}
            {/*<EditorProvider>*/}
            {/*    <FileList/>*/}
            {/*    <CodeEditor />*/}
            {/*    <DependencyView/>*/}
            {/*    <CodeView />*/}
            {/*</EditorProvider>*/}
        </EditorContext.Provider>
    );
}

export default EditorProvider;