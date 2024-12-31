import './testTable.css'
import CoverLetterRow from "./components/CoverLetterRow";
import React from 'react';

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
    id: number;
    text: string;
    colspan: number;
}

interface Props {
    content?: RowData[];
    userInfo?: any;
}

const CoverLetter = ({content, userInfo}: Props) => {
    return (
        <div style={{width: '210mm'}} className={'page'}>
            <table>
                <thead>
                <tr>
                    <th style={{width: '15%'}} rowSpan={5}>img</th>
                    <th style={{width: '10%'}} colSpan={2}>이름</th>
                    <td style={{width: '15%'}} colSpan={3}>{userInfo?.name || ''}</td>
                    <th style={{width: '10%'}}>영문</th>
                    <td style={{width: '15%'}}>{userInfo?.engName || ''}</td>
                    <th style={{width: '10%'}}>한문</th>
                    <td style={{width: '15%'}}>{userInfo?.chnName || ''}</td>
                </tr>
                <tr>
                    <th colSpan={2}>주민번호</th>
                    <td colSpan={5}>{userInfo?.juminNumber || ''}</td>
                    <th>나이</th>
                    <td>{userInfo?.age || ''}</td>
                </tr>
                <tr>
                    <th colSpan={2}>휴대폰</th>
                    <td colSpan={4}>{userInfo?.phone || ''}</td>
                    <th>전화번호</th>
                    <td colSpan={3}>{userInfo?.tel || ''}</td>
                </tr>
                <tr>
                    <th colSpan={2}>email</th>
                    <td colSpan={4}>{userInfo?.email || ''}</td>
                    <th>sns</th>
                    <td colSpan={3}>{userInfo?.sns || ''}</td>
                </tr>
                <tr>
                    <th colSpan={2}>주소</th>
                    <td colSpan={7}>{userInfo?.address || ''}</td>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            {content && content.map((item, index) =>
                <React.Fragment key={index}>
                    <table>
                        <thead>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={10} style={{height: '100px', border: 'none'}}></td>
                            </tr>
                            <CoverLetterRow content={item}/>
                        </tbody>
                    </table>
                </React.Fragment>
            )}
        </div>
    )
}

export default CoverLetter;