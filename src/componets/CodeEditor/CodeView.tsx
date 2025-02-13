import {createHtml} from "./esbuild/EsbuildSystem";
import React from "react";
import useEditor from "./hook/useEditor";



const CodeView: React.FC = () => {
    const { transformedCode,build,useDependency } = useEditor();
    const { importMap } = useDependency
    return (
        <div style={{ width:'100%', height:'100%' }}>
            <button onClick={()=>build()}>Run</button>
            <iframe srcDoc={createHtml(transformedCode,importMap)} style={{ width:'100%', height:'100%' }}/>
        </div>
    );
}
export default React.memo(CodeView);