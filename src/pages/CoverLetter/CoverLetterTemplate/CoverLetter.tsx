import './testTable.css'
import CoverLetterRow from "./components/CoverLetterRow";
import React from 'react';
interface RowData{
    title:string;
    subTitle:Content[];
    text:Text[][];
}
interface Content{
    id:number;
    title:string;
    colspan:number;
}
interface Text{
    id:number;
    title:string;
    colspan:number;
}
const CoverLetter = () => {
    const headerData = {
        imgUrl:'',
        name:'이름',
        engName:'',
        chnName:'',
        juminNumber:'',
        age:'',
        phone:'',
        tel:'',
        email:'',
        sns:'',
        address:''
    }
    const RowData:RowData[] =[
        {
            title:'학력사항',
            subTitle:[
                {
                    id:1,
                    title:'학교 및 전공',
                    colspan:1
                },
                {
                    id:2,
                    title:'학점',
                    colspan:6
                },
                {
                    id:3,
                    title:'구분',
                    colspan:1
                },
                {
                    id:4,
                    title:'재학기간',
                    colspan:3
                }
            ],
            text:[[
                {
                    id:1,
                    title:'OO대',
                    colspan:1
                },
                {
                    id:2,
                    title:'B',
                    colspan:6
                },
                {
                    id:3,
                    title:'',
                    colspan:1
                },
                {
                    id:4,
                    title:'202220301~20240301',
                    colspan:3
                }
            ]]
        },
        {
            title:'자격증',
            subTitle:[
                {
                    id:1,
                    title:'이름',
                    colspan:1
                },
                {
                    id:2,
                    title:'합격일',
                    colspan:6
                },
                {
                    id:3,
                    title:'점수',
                    colspan:1
                },
                {
                    id:4,
                    title:'구분',
                    colspan:3
                }
            ],
            text:[
                [{
                    id:1,
                    title:'OO기능사',
                    colspan:1
                },
                {
                    id:2,
                    title:'202220301',
                    colspan:6
                },
                {
                    id:3,
                    title:'80',
                    colspan:1
                },
                {
                    id:4,
                    title:'',
                    colspan:3
                }],
                [{
                    id:1,
                    title:'AAA기능사',
                    colspan:1
                },
                {
                    id:2,
                    title:'202220301',
                    colspan:6
                },
                {
                    id:3,
                    title:'80',
                    colspan:1
                },
                {
                    id:4,
                    title:'',
                    colspan:3
                }]
            ]
        }
    ]
    // console.log(RowData);
    // const string =JSON.stringify(RowData)
    // console.log(string);
    // const parse = JSON.parse(string)
    // console.log(parse);
    return (
        <div style={{width:'210mm'}} className={'page'}>
            <table>
                <thead>
                    <tr>
                        <th style={{width: '15%'}} rowSpan={5}>img</th>
                        <th style={{width: '10%'}} colSpan={2}>이름</th>
                        <td style={{width: '15%'}} colSpan={3}>{headerData?.name||''}</td>
                        <th style={{width: '10%'}}>영문</th>
                        <td style={{width: '15%'}}>{headerData?.engName||''}</td>
                        <th style={{width: '10%'}}>한문</th>
                        <td style={{width: '15%'}}>{headerData?.chnName||''}</td>
                    </tr>
                    <tr>
                        <th colSpan={2}>주민번호</th>
                        <td colSpan={5}>{headerData?.juminNumber||''}</td>
                        <th>나이</th>
                        <td>{headerData?.age||''}</td>
                    </tr>
                    <tr>
                        <th colSpan={2}>휴대폰</th>
                        <td colSpan={4}>{headerData?.phone||''}</td>
                        <th>전화번호</th>
                        <td colSpan={3}>{headerData?.tel||''}</td>
                    </tr>
                    <tr>
                        <th colSpan={2}>email</th>
                        <td colSpan={4}>{headerData?.email||''}</td>
                        <th>sns</th>
                        <td colSpan={3}>{headerData?.sns||''}</td>
                    </tr>
                    <tr>
                        <th colSpan={2}>주소</th>
                        <td colSpan={7}></td>
                    </tr>
                </thead>
                <tbody>
                    {RowData.map((item,index) =>
                        <React.Fragment key={index}>
                            <tr>
                                <td colSpan={10} style={{height:'100px',border:'none'}}></td>
                            </tr>
                            <CoverLetterRow content={item}/>
                        </React.Fragment>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default CoverLetter;