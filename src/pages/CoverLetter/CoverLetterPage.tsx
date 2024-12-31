import CoverLetter from "./CoverLetterTemplate/CoverLetter";
import CoverLetterInData from "./CoverLetterInData";
import {useState} from "react";


const CoverLetterPage = () => {
    const [inputData, setInputData] = useState();
    const [rowData, setRowData] = useState();
    const rowDataHandler = (data:any) => {
        setRowData(data);
    }
    const inputDataHandler = (data:any) => {
        setInputData(data);
    }
    return (
        <div style={{display: 'flex'}}>
            <div>
                <h1>Cover Letter</h1>
                <CoverLetter content={rowData} userInfo = {inputData}/>
            </div>
            <CoverLetterInData rowDataHandler={rowDataHandler} inputDataHandler={inputDataHandler}/>

        </div>
    );
}

export default CoverLetterPage;