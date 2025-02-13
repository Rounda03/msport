import * as esbuild from 'esbuild-wasm'

interface ImportMap {
    imports: Map<string, string>;
}
interface RecordImportMap {
    imports: Record<string, string>;
}
const importMap: ImportMap = {
    "imports": new Map<string, string>([
        ["react", "https://esm.sh/react@18.2.0"],
        ["react-dom/", "https://esm.sh/react-dom@18.2.0/"],
        ["jsx", 'https://esm.sh/react@18.2.0/jsx-runtime'],
        ['monaco-editor', 'https://esm.sh/monaco-editor'],
        ['@monaco-editor/react', 'https://esm.sh/@monaco-editor/react?deps=react@18.2.0'],
        ['esbuild-wasm', 'https://esm.sh/esbuild-wasm'],
        ['styled-components', 'https://esm.sh/styled-components?deps=react@18.2.0'],
        ['styled-components/', 'https://esm.sh/styled-components/?deps=react@18.2.0'],
    ])
}

const initializeEsbuild = async () => {
    try{
        await esbuild.initialize({
            worker: true,
            // wasmURL: 'node_modules/esbuild-wasm/esbuild.wasm',
            wasmURL: 'https://esm.sh/esbuild-wasm@0.24.2/esbuild.wasm',
        });
    }
    catch (error) {
        console.error('esbuild 초기화 오류:', error);
    }
};

const createHtml = (code: string, importMap: ImportMap | RecordImportMap) => {
    const defaultImportMap = {
        "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom/": "https://esm.sh/react-dom@18.2.0/",
            "@mui/material": "https://esm.sh/@mui/material@5.14.20?deps=react@18.2.0",
            "@emotion/react": "https://esm.sh/@emotion/react@11.11.1",
            "@emotion/styled": "https://esm.sh/@emotion/styled@11.11.0",
            "react-error-boundary": "https://esm.sh/react-error-boundary@5.0.0?deps=react@18.2.0",
            "react/": "https://esm.sh/react@18.3.1/",
            "jsx": 'https://esm.sh/react@18.2.0/react/jsx-dev-runtime/',
            "@mui/icons-material": "https://esm.sh/@mui/icons-material@5.14.20",
            "axios": "https://esm.sh/axios@1.6.7",
            "monaco-editor": "https://esm.sh/monaco-editor",
            "@monaco-editor/react": "https://esm.sh/@monaco-editor/react?deps=react@18.2.0",
        }
    }
    // 사용자계정>coderepos/프로젝트명/CodeEditor.tsx.txt
    // (이름, 코드)
    //
    // 사용자uuid>프로젝트명>
    //     파일명:
    //  경로::"사용자계정>coderepos/프로젝트명/CodeEditor.tsx.txt"
    return `<html lang="kr">
                       <head>
                            <title>Code Editor</title>
                            <script type="importmap">
                                ${JSON.stringify(importMap || defaultImportMap)}
                            </script>
                       </head>
                       <body>
                           <div id="root"></div>
                           <script type="module">
                                 ${code}
                           </script>
                       </body>
                   </html>`
}

//수정 필요 지금 쓸모가 없는 거 그냥 tsx만 내보냄
function getLoader(filePath: string) {
    const extension = filePath.split('.').pop()?.toLowerCase(); //여기 부분 수정 하면됌
    switch (extension) {
        case 'jsx':
        case 'tsx':
            return 'tsx';
        case 'js':
        case 'ts':
            return 'ts';
        case 'css':
            return 'css';
        case 'json':
            return 'json';
        default:
            return 'tsx';
    }
}

const plugin = (mapData:Map<string, string>): esbuild.Plugin =>{

    const virtualFs: esbuild.Plugin = {
        name: 'virtual-fs',
        setup(build) {
            build.onResolve({filter: /.*/}, (args) => {
                const {path} = args;

                if (mapData.has(path)) {// 가상파일시스템에 있는 파일
                    return {path, namespace: 'virtual-fs'};
                }
                if (path.startsWith('react') || path.startsWith('react-dom')) {// 외부 모듈로 처리 (기본적으로 react, react-dom 만 처리)
                    return {path: path, external: true, namespace: 'virtual-fs'}
                }

                const importMapPath: string = importMap.imports.get(path) || '';

                if (importMapPath) {
                    return {path: path, external: true, namespace: 'virtual-fs'};
                }
                // 외부 모듈로 처리
                if (path.startsWith('http') || path.startsWith('https')) {
                    return {path, external: true, namespace: 'virtual-fs'};
                }

                return {path: path.split('.')[1], namespace: 'virtual-fs'};
            });
            build.onLoad({filter: /.*/, namespace: 'virtual-fs'}, async (args) => {
                const {path} = args;
                const fileName = path.split('.')[0] === 'index' ? path : path + '.tsx';
                const content = mapData.get(fileName);
                if (content) {
                    return {
                        contents: content,
                        loader: getLoader(path)
                    };
                }
            });
        }
    };

    return virtualFs;
}

interface IBundler {
    readFile(): Map<string, string>;

    addFile(pathName: string, content: string): void;

    removeFile(pathName: string): void;

    bundle(entryPoint: string): Promise<string>;

    getDependencies(): ImportMap;

    addDependency(dependencyName: string, root: string): void;

    removeDependency(dependencyName: string): void;

    resetDependency(): void;
}

class Bundler implements IBundler {
    private virtualFileSystem: Map<string, string> = new Map<string, string>();
    private imp;
    static value =0;
    constructor() {
        this.imp = importMap;
        this.addFile('index.tsx', indexCode);
        Bundler.value++;
        console.log('Bundler 생성자 호출', Bundler.value);
    }

    readFile() {
        return this.virtualFileSystem;
    }

    addFile(pathName: string, content: string) {
        this.virtualFileSystem.set(pathName, content);
    }

    removeFile(pathName: string) {
        this.virtualFileSystem.delete(pathName);
    }

    getDependencies() {
        return this.imp;
    }

    addDependency(dependencyName: string, root: string) {
        this.imp.imports.set(dependencyName, root);
    }

    removeDependency(dependencyName: string) {
        this.imp.imports.delete(dependencyName);
    }

    resetDependency() {
        this.imp.imports.clear();
    }

    async bundle(entryPoint: string) {
        try {
            const result = await esbuild.build({
                entryPoints: [entryPoint],
                bundle: true,
                write: false,
                plugins: [plugin(this.virtualFileSystem)],
                format: 'esm',
                target: 'es2022',
                minify: false,
                // sourcemap: 'inline',
                sourcemap: true,
                jsxFactory: 'React.createElement',
                jsxFragment: 'React.Fragment',
                jsxImportSource: 'resume',
                jsxSideEffects: false,
                jsx: 'transform',
                jsxDev: false,
                define: {
                    'process.env.NODE_ENV': '"development"'
                }
            });

            return result.outputFiles[0].text;
        } catch (error) {
            console.error('번들링 오류:', error);
            throw error;
        }
    }
}

/* ---------기본 코드--------- */
const app_code = `import React from 'react'

const App = () => {
    return (
        <div>
            <h1>Hello World</h1>
        </div>
    );
};

export default App;
`
const indexCode = `import { createRoot } from 'react-dom/client';
import React from 'react'
import App from './App';

createRoot(document.getElementById('root')).render(<App />);
`;
/* ---------기본 코드--------- */

export default Bundler;
export {app_code, indexCode, createHtml, initializeEsbuild}
export type {IBundler, ImportMap}