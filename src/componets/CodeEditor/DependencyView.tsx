import {useState} from "react";
import useEditor from "./hook/useEditor";


const DependencyView = () => {
    const {useDependency} = useEditor();
    const {dependency, addDependency} = useDependency;
    const [input, setInput] = useState('');
    const onClick = () => {
        if (!input) return;
        addDependency(input);
    }
    return (
        <div style={{border: '1px solid red'}}>
            <h2>Dependency View</h2>
            <div>
                <input type={'text'} placeholder={'dependency'} value={input}
                       onChange={(e) => setInput(e.target.value)}/>
                <button onClick={onClick}>
                    추가
                </button>
                <ul>
                    {dependency.map((item, index) => (
                        <li key={index}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default DependencyView;