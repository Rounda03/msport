import {useState} from "react";

export interface UseDependencyType {
    importMap: {
        imports: Record<string, string>
    };
    dependency: string[];

    mountedSetImportMap: (newImportMap:  Map<string,string>) => void;

    readDependency: () => { dependency: string[], importMap: { imports: Record<string, string> } };
    addDependency: (newDependency: string) => void;
    removeDependency: (dependencyName: string) => void;
    resetDependency: () => void;
}

const useDependency = (): UseDependencyType => {
    const [importMap, setImportMap] = useState({imports: {}});
    const [dependency, setDependency] = useState<string[]>([]);

    const mountedSetImportMap = (newImportMap:  Map<string,string>) => {
        const dep: string[] = Array.from(newImportMap.keys());
        setDependency(dep);
        setImportMap({imports: Object.fromEntries(newImportMap)});
    }

    const readDependency = () => {
        return {dependency, importMap};
    }
    const addDependency = (newDependency: string) => {
        setDependency([...dependency, newDependency]);
        setImportMap({
            imports: {
                ...importMap.imports,
                [newDependency]: `https://esm.sh/${newDependency}`,
            }
        });
    }
    const removeDependency = (dependencyName: string) => {
        setDependency(dependency.filter((item) => item !== dependencyName));
        const newImportMap = {...importMap.imports} as Record<string, string>;
        delete newImportMap[dependencyName];
        setImportMap({imports: newImportMap});
    }
    const resetDependency = () => {
        setDependency([]);
        setImportMap({imports: {}});
    }

    return {
        importMap,
        dependency,
        mountedSetImportMap,
        readDependency,
        addDependency,
        removeDependency,
        resetDependency,
    }
}

export default useDependency;