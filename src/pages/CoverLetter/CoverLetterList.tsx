import {useState} from "react";
import {usePopupAnimation, usePopupController} from "../../componets/PopupManager";

const CoverLetterList = () => {
    const [file, setFile] = useState();
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const { showPopup } = usePopupController();
    const { setAnimation } = usePopupAnimation();
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFileUrl(`${URL.createObjectURL(selectedFile)}#toolbar=0&navpanes=0&scrollbar=0`);
        }
    };
    const onClick = (key:string) =>{
        showPopup(key,fileUrl);
        setAnimation([
            {opacity:0,
                top:'-50%'
            },
            {opacity:1,
                top:'-50%',
                left:'-50%'
            },
            {opacity:1,
                top:'0%'
            }
        ],{
            duration:1000,
            fill:'forwards',
            easing:'ease-in-out'
        });
    }

    return (
        <div style={{width:'100%',border:'1px solid blue',padding:'15px'}}>
            <div>
                <input type={'file'} onChange={onChange}/>
            </div>
            <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                <div style={{width: '210px', height: '280px', border: '1px solid red'}} onClick={()=>onClick('pdfPopup')}>
                    <iframe src={fileUrl ? fileUrl : ''} style={{width: '100%', height: '100%'}}></iframe>
                </div>
                <div style={{width: '190.5px', height: '270px'}} onClick={()=>onClick('pdfPopup')}>
                    <div style={{pointerEvents: 'none',width:'100%',height:'100%'}}>
                        <embed
                            src={fileUrl ? fileUrl : ''}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                            style={{pointerEvents: 'none'}}
                        />
                    </div>
                </div>

                <div style={{width: '210px', height: '280px', border: '1px solid red'}} onClick={()=>onClick('popup')}></div>
            </div>
        </div>
    );
}

export default CoverLetterList;