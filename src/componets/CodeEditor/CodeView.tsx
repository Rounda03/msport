import {createHtml} from "./esbuild/EsbuildSystem";
import React from "react";
import useEditor from "./hook/useEditor";



const CodeView: React.FC = () => {
    const { transformedCode,build,useDependency } = useEditor();
    const { importMap } = useDependency
    return (
        <div>
            <button onClick={()=>build()}>Run</button>
            <iframe srcDoc={createHtml(transformedCode,importMap)} style={{flex: 1}}/>
        </div>
    );
}
export default CodeView;