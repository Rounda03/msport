import React, {createContext, useEffect, useMemo, useState} from "react";


export interface ConfigType {
    key: string;
    component: React.ComponentType<FallbackProps>;
}

interface Props {
    children: React.ReactNode;
    config?: ConfigType[];
}

export interface FallbackProps<T = any> {
    reset: () => void;
    state?: boolean;
    popupKey?: string;
    propValue?: T
}
interface KeyFrameSetting {
    enter: {
        keyFrame: Keyframe[];
        option: KeyframeAnimationOptions | number;
    };
    exit: {
        keyFrame: Keyframe[];
        option: KeyframeAnimationOptions | number;
    };
}
interface ContextType {
    state: boolean;
    resetPopupBoundary: () => void;
    showPopupBoundary: <T>(key?: string, value?: T) => void;
    propValueHandler: <T>(value: T) => void;
    config?: ConfigType[];
    animationRef: React.RefObject<HTMLDivElement>;
    keyFrameHandler: (frame: KeyFrameSetting) => void;
    animationOption?: KeyFrameSetting;
    // setKeyHandler:(key:string)=>void;
}

/** PopupManager config검사 및 생성 */
export const createConfig = (config: ConfigType[]): ConfigType[] => {
    if (!config) return [];
    const keyMap = new Map<string, number>();
    config.forEach((item, index) => {
        if (!item.key) throw new Error('key가 없습니다');
        if (!item.component) throw new Error('component가 없습니다');
        if (keyMap.has(item.key)) {
            const firstIndex = keyMap.get(item.key);
            throw new Error(`key값이 중복됩니다. "${item.key}" 중복위치 index: ${firstIndex} && index: ${index}`);
        }
        keyMap.set(item.key, index);
    });
    return config;
}
const PopupManagerContext = createContext<ContextType | undefined>(undefined);
const configValidation = (config: ConfigType[] | undefined): boolean => {
    if (!config) return false;
    if (config.length === 0) return false;
    const keyMap = new Set<string>();
    config.forEach((item) => {
        if (!item.key) return false;
        if (!item.component) return false;
        if (keyMap.has(item.key)) return false
        keyMap.add(item.key);
    });
    return true;
}

const PopupManager: React.FC<Props> = ({children, config}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [key, setKey] = useState<string>('');
    const [propValue, setPropValue] = useState<any>();
    const [animationOption, setAnimationOption] = useState<KeyFrameSetting>();
    const animationRef = React.useRef<HTMLDivElement | null>(null);
    const memoConfigValidation = useMemo(() => configValidation(config), [config]);
    if (!memoConfigValidation) throw new Error('config가 잘못되었습니다 createConfig 사용!');
    const resetPopup = () => {
        if (animationRef.current && animationOption) {
            animationRef.current.animate(animationOption.exit.keyFrame,animationOption.exit.option).onfinish = () => {
                setIsOpen(false);
                setKey('');
                setPropValue(undefined);
                animationRef.current = null;
            }
            return;
        }

        setIsOpen(false);
        setKey('');
        setPropValue(undefined);
    }
    const showPopup = <T,>(pkey: string = '', value: T) => {
        if (!config) return;
        if (pkey === '') throw new Error('key값이 없습니다');
        if (!config.find((item) => item?.key === pkey)) throw new Error(`"${pkey}"에 해당하는 팝업이 없습니다`);
        setIsOpen(true);
        setKey(pkey);
        setPropValue(value);
    }
    const keyFrameHandler = (frame:KeyFrameSetting) => {
        setAnimationOption(frame);
    }
    const propValueHandler = <T,>(value: T) => {
        setPropValue(value);
    }
    const render = (key: string) => {
        if (!config) return null;
        if (key === '') return null;
        if (!isOpen) return null;
        const Component = config.find((item) => item?.key === key)?.component;
        if (!Component) return null;
        return <Component state={isOpen} reset={resetPopup} propValue={propValue} popupKey={key}/>;
        // return Component({state:isOpen, reset:resetPopup, propValue:propValue, popupKey:key});
    }
    const memoRender = useMemo(() => render(key), [isOpen, key, propValue, config, animationOption]);
    const contextValue = useMemo(() => ({
        state: isOpen,
        resetPopupBoundary: resetPopup,
        showPopupBoundary: showPopup,
        propValueHandler: propValueHandler,
        config: config,
        animationRef: animationRef,
        keyFrameHandler: keyFrameHandler,
        animationOption: animationOption,
    }), [config, isOpen, animationOption, animationRef]);
    useEffect(() => {
        if (isOpen) {
            if (animationRef.current&&animationOption) {
                animationRef.current.animate(animationOption.enter.keyFrame, animationOption.enter.option);
            }
        }
    }, [isOpen]);
    return (
        <PopupManagerContext.Provider value={contextValue}>
            {memoRender}
            {children}
        </PopupManagerContext.Provider>
    );
}

export default PopupManager;

interface UsePopupControllerType {
    /* 상태값 */
    state: boolean;
    /* 팝업 초기화 */
    resetPopup: () => void;
    /* 팝업 보이기 */
    showPopup: <T>(key: string, value?: T) => void;

    animationRef: React.RefObject<HTMLDivElement>;
}

export const usePopupController = (): UsePopupControllerType => {
    const value = React.useContext(PopupManagerContext);
    if (value === null || value === undefined || typeof value.resetPopupBoundary !== 'function') {
        throw new Error('PopupManager 안에서 사용하세요');
    }
    return useMemo(() => ({
        state: value.state,
        resetPopup: value.resetPopupBoundary,
        showPopup: value.showPopupBoundary,
        animationRef: value.animationRef,
    }), [value, value.state, value.animationRef]);
}


interface UseSetAnimationType {
    animationRef: React.RefObject<HTMLDivElement>;
    setAnimation: (frame?: Keyframe[], option?: KeyframeAnimationOptions | number) => void;
    createKeyFrame: (keyFrame: Keyframe[]) => Keyframe[];
    createOption: (option: KeyframeAnimationOptions | number) => KeyframeAnimationOptions | number;
    animationOption?: KeyFrameSetting;
}

export const usePopupAnimation = ():UseSetAnimationType => {
    const value = React.useContext(PopupManagerContext);
    if (value === null || value === undefined || typeof value.animationRef !== 'object') {
        throw new Error('PopupManager 안에서 사용하세요');
    }
    const defaultOption: KeyframeAnimationOptions = {
        duration: 500,
        fill: 'forwards',
        easing: 'ease-in-out',
    }
    const defaultKeyFrame: Keyframe[] = [
        {opacity: 0, top: '-100%'},
        {opacity: 1, left: '20%'},
        {opacity: 1, top: '5%'},
    ]

    const createKeyFrame= (keyFrame: Keyframe[]): Keyframe[] => {
        return keyFrame
    }
    const createOption = (option: KeyframeAnimationOptions | number): KeyframeAnimationOptions | number => {
        return option
    }
    const setAnimation = (frame?: Keyframe[], option?:KeyframeAnimationOptions | number) => {
        value.keyFrameHandler({
            enter: {
                keyFrame: frame||defaultKeyFrame,
                option: option||defaultOption
            },
            exit: {
                keyFrame: frame? [...frame].reverse() : [...defaultKeyFrame].reverse(),
                option: option||defaultOption
            }
        });
    }
    return useMemo(() => ({
        animationRef: value.animationRef,
        animationOption: value.animationOption,
        setAnimation: setAnimation,
        createKeyFrame: createKeyFrame,
        createOption: createOption,
    }), [value, value.state, value.animationRef]);
}