import {usePopupAnimation, usePopupController} from "./PopupManager";
import React from "react";
/* overlay 같은 경우 -1 */
interface Props {
    children?: React.ReactNode;
    overlay?: boolean;
    overlayBg?: boolean;
    width?: string;
    height?: string;
    top?: string;
    left?: string;
    transform?: string;
    /* 이 아래는 옵션*/
    zIndex?: number;
    style?: React.CSSProperties;
    x?: 'left' | 'center' | 'right';
    y?: 'top' | 'center' | 'bottom';
    popupOnClick?: () => void;
    openPopup?: () => void;
    closePopup?: () => void;
}

export interface AnimationProps {
    overlay?: boolean;
    popup?: boolean;
}

const Popup: React.FC<Props> = ({children, overlay = false, overlayBg = true, style, width, height, top, left,
                                    openPopup, closePopup,
                                    popupOnClick, transform, zIndex, x, y}) => {
    const { resetPopup, state } = usePopupController();
    const { animationRef } = usePopupAnimation();
    const onClick = () => {
        popupOnClick?.();
    }
    const xString =['left', 'center', 'right'];
    const yString = ['top', 'center', 'bottom'];
    const xP = ['10%', '50%', '90%'];
    const yP = ['10%', '50%', '90%'];
    const xySetting = (xy: 'x' | 'y', value: 'left' | 'right' | 'top' | 'center' | 'bottom') => {
        if (xy === 'x') {
            const index = xString.indexOf(value);
            if (index === -1) return '50%';
            return xP[index];
        } else {
            const index = yString.indexOf(value);
            if (index === -1) return '50%';
            return yP[index];
        }
    }

    const center1 = {
        top: xySetting('y', y as 'top' | 'center' | 'bottom'),
        left: xySetting('x', x as 'left' | 'center' | 'right'),
        // transform: 'translate(-50%,-50%)',
    }
    const popupStyle: React.CSSProperties = style || {
        // border: '1px solid red',
        position: 'fixed',
        width: width || '300px',
        height: height || '250px',
        top: top || '5%',
        left: left || '50%',
        transform: transform || 'translateX(-50%)',
        zIndex: zIndex || 1000,
    }
    const configPopupStyle = x && y ? {...popupStyle, ...center1} : popupStyle;
    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundColor: overlayBg ? 'rgba(0,0,0,0.5)' : '',
        top: 0,
        left: 0,
        zIndex: zIndex ? zIndex-1 : 999,
    }
    /** 화면이 열릴때, 닫힐때 */
    React.useEffect(() => {
        openPopup?.();
        return () => {
            closePopup?.();
        }
    }, [state]);


    return (
        <>
            {overlay && <div role={'overlay'} style={overlayStyle} onClick={resetPopup}></div>}
            <div  role={'popup'} onClick={onClick} style={configPopupStyle} className={'popup'} ref={animationRef}>
                {children}
            </div>
        </>
    );
}

export default Popup;