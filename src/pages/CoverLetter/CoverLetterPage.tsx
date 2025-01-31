import CoverLetter from "./CoverLetterTemplate/CoverLetter";
import CoverLetterInData from "./CoverLetterInData";
import React, {useState} from "react";
import CoverLetterList from "./CoverLetterList";
import PopupManager, {createConfig, FallbackProps} from "../../componets/PopupManager";
import Popup from "../../componets/Popup";



const CoverLetterPage = () => {
    const [inputData, setInputData] = useState(
        // {
        //     imgUrl: '',
        //     name: '홍길동',
        //     engName: 'Hong Gil Dong',
        //     chnName: '洪吉同',
        //     juminNumber: '123456-1234567',
        //     age: '30',
        //     phone: '010-1234-1234',
        //     tel: '02-1234-1234',
        //     email: 'asdf'
        // }
    );
    const [rowData, setRowData] = useState();
    const rowDataHandler = (data:any) => {
        setRowData(data);
    }
    const inputDataHandler = (data:any) => {
        setInputData(data);
    }
    const config = createConfig([
        {
            key: 'popup',
            component:()=>(
                <Popup top={'0%'} left={'40%'} overlay={true}>
                    <CoverLetter content={rowData} userInfo={inputData}/>
                </Popup>
            ),

        },
        {
            key:'pdfPopup',
            component:({reset, propValue})=>(
                <Popup top={'0%'} left={'50%'} overlay={true} width={'210mm'}height={'90%'}>
                    <iframe src={propValue} style={{width: '100%', height: '100%'}}></iframe>
                    <button onClick={reset}>Close</button>
                </Popup>
            )
        }
    ])
    return (
        <div style={{display: 'flex'}}>
            <div>
                <h1>Cover Letter</h1>
                <CoverLetter content={rowData} userInfo = {inputData}/>
            </div>
            <CoverLetterInData rowDataHandler={rowDataHandler} inputDataHandler={inputDataHandler}/>
            <PopupManager config={config}>
                <CoverLetterList />
            </PopupManager>
        </div>
    );
}

export default CoverLetterPage;