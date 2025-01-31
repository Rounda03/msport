import {useState} from "react";
import Input from "../../componets/Input";
import QualificationItem from "./components/QualificationItem";
import {useFileUploadAndFetch} from "../../hook/useFile/useFileUploadAndFetch ";

interface RowData {
    title: string;
    subTitle: Content[];
    text: Text[][];
}

interface Content {
    id: number;
    title: string;
    colspan: number;
}

interface Text {
    id: number | string;
    text: string;
    colspan: number;
}

const inputName = {
    IMGURL: 'imgUrl',
    NAME: 'name',
    ENGNAME: 'engName',
    CHNNAME: 'chnName',
    JUMINNUMBER: 'juminNumber',
    AGE: 'age',
    PHONE: 'phone',
    TEL: 'tel',
    EMAIL: 'email',
    SNS: 'sns',
    ADDRESS: 'address'
}
const placeholders = {
    imgUrl: '이미지 URL을 입력하세요',
    name: '이름을 입력하세요',
    engName: '영문 이름을 입력하세요',
    chnName: '한문 이름을 입력하세요',
    juminNumber: '주민번호를 입력하세요',
    age: '나이를 입력하세요',
    phone: '휴대폰을 입력하세요',
    tel: '전화번호를 입력하세요',
    email: '이메일을 입력하세요',
    sns: 'SNS를 입력하세요',
    address: '주소를 입력하세요'
};

interface Props {
    rowDataHandler?: (rowData: RowData[]) => void;
    inputDataHandler?: (inputData: any) => void;
}
interface InputData {
    imgUrl: File | null;
    name: string;
    engName: string;
    chnName: string;
    juminNumber: string;
    age: string;
    phone: string;
    tel: string;
    email: string;
    sns: string;
    address: string;
}
const CoverLetterInData = ({rowDataHandler, inputDataHandler}: Props) => {
    const [inputData, setInputData] = useState<InputData>({
        imgUrl: null,
        name: '',
        engName: '',
        chnName: '',
        juminNumber: '',
        age: '',
        phone: '',
        tel: '',
        email: '',
        sns: '',
        address: ''
    });

    const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newData = {...inputData, [e.target.name]: e.target.value}
        setInputData(newData)
        inputDataHandler?.(newData)
    }
    const {handleUpload, handleFileChange} = useFileUploadAndFetch();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e);
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const newData = {...inputData, imgUrl: selectedFile}
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setInputData(newData);
            inputDataHandler?.(newData);
        }
    };
    return (
        <div>
            <h1>입력</h1>
            <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
                <button onClick={() => console.log(inputData.imgUrl)}>입력값 확인</button>
                <button onClick={() => handleUpload('test')}>저장</button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
                    <img src={previewUrl||''} alt="미리보기" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                    <Input type={'FILE'} name={inputName.IMGURL} onChange={handleFileInputChange}
                           placeholder={placeholders.imgUrl}
                           label={'이미지 URL'}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
                    <Input type={'text'} name={inputName.NAME} onChange={inputOnChange}
                           placeholder={placeholders.name}
                           label={'이름'}/>
                    <Input type={'text'} name={inputName.ENGNAME} onChange={inputOnChange}
                           placeholder={placeholders.engName} label={'영문'}/>
                    <Input type={'text'} name={inputName.CHNNAME} onChange={inputOnChange}
                           placeholder={placeholders.chnName} label={'한문'}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
                    <Input type={'text'} name={inputName.JUMINNUMBER} onChange={inputOnChange}
                           placeholder={placeholders.juminNumber} label={'주민번호'}/>
                    <Input type={'text'} name={inputName.AGE} onChange={inputOnChange}
                           placeholder={placeholders.age}
                           label={'나이'}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
                    <Input type={'text'} name={inputName.PHONE} onChange={inputOnChange}
                           placeholder={placeholders.phone}
                           label={'휴대폰'}/>
                    <Input type={'text'} name={inputName.TEL} onChange={inputOnChange}
                           placeholder={placeholders.tel}
                           label={'전화번호'}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
                    <Input type={'text'} name={inputName.EMAIL} onChange={inputOnChange}
                           placeholder={placeholders.email}
                           label={'이메일'}/>
                    <Input type={'text'} name={inputName.SNS} onChange={inputOnChange}
                           placeholder={placeholders.sns}
                           label={'SNS'}/>
                </div>
                <Input type={'text'} name={inputName.ADDRESS} onChange={inputOnChange}
                       placeholder={placeholders.address}
                       label={'주소'}/>
            </div>
            <QualificationItem rowDataHandler={rowDataHandler}/>
        </div>
    )
}

export default CoverLetterInData;