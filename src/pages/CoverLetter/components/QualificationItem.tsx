import { useEffect, useState} from "react";
import {Button} from "@mui/material";
import Input from "../../../componets/Input";

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

interface Props {
    rowDataHandler?: (rowData: RowData[]) => void;
}

const QualificationItem = ({rowDataHandler}: Props) => {
    const [rowData, setRowData] = useState<RowData[]>([
        {
            title: 'title1',
            subTitle: [
                {
                    id: 1,
                    title: 'subTitle1',
                    colspan: 1
                }
            ],
            text: [[
                {
                    id: 1,
                    text: 'text1',
                    colspan: 1
                }
            ]]
        }
    ]);
    const addRow = () => {
        const newRowData = [...rowData];
        newRowData.push({
            title: '',
            subTitle: [
                {
                    id: 1,
                    title: '',
                    colspan: 1
                }
            ],
            text: [[
                {
                    id: 1,
                    text: '',
                    colspan: 1
                }
            ]]
        });
        rowDataHandler?.(newRowData);
        setRowData(newRowData);
    }
    const deleteRow = (index: number) => {
        const newRowData = [...rowData];
        newRowData.splice(index, 1);
        rowDataHandler?.(newRowData);
        setRowData(newRowData);
    }

    const addSubTitle = (index: number) => {
        if(rowData[index].subTitle.length > 9 ) return;
        const newRowData = [...rowData];
        const id = newRowData[index].subTitle.length + 1;
        newRowData[index].subTitle.push({
            id: id,
            title: '',
            colspan: 1
        });
        newRowData[index].text.length !== 0 &&
        newRowData[index].text.forEach((_text, textIndex) => {
            addColumn(index, textIndex);
        });
        rowDataHandler?.(newRowData);
        setRowData(newRowData);
    }
    const deleteSubTitle = (index: number, subIndex: number) => {
        const newRowData = [...rowData];
        newRowData[index].subTitle.splice(subIndex, 1);
        newRowData[index].subTitle.length === 0 ?
            newRowData[index].text = [[]] :
            newRowData[index].text.forEach((_text, textIndex) => {
                deleteColumn(index, textIndex, subIndex);
                console.log('textIndex:', textIndex);
            });
        rowDataHandler?.(newRowData);
        setRowData(newRowData);
    }

    const addText = (index: number) => {
        console.log('rowData[index].subTitle.length:', rowData[index].subTitle.length);
        if (rowData[index].subTitle.length === 0) return;
        const newRowData = [...rowData];
        const row: Text[] = [];
        newRowData[index].subTitle.forEach((sub) => {
            row.push({
                id: sub.id,
                text: '',
                colspan: 1
            })

        });
        newRowData[index].text.push(row);
        rowDataHandler?.(newRowData);
        setRowData(newRowData);
    }
    const deleteText = (index: number, textIndex: number) => {
        const newRowData = [...rowData];
        newRowData[index].text.splice(textIndex, 1);
        rowDataHandler?.(newRowData);
        setRowData(newRowData);
    }

    const addColumn = (index: number, rowIndex: number, subTid?: string) => {
        const newRowData = [...rowData];
        const id = subTid || newRowData[index].text[rowIndex].length + 1;
        newRowData[index].text[rowIndex].push({
            id: id,
            text: '',
            colspan: 1
        });
        setRowData(newRowData);
        rowDataHandler?.(newRowData);
    }
    const deleteColumn = (index: number, rowIndex: number, columIndex: number) => {
        const newRowData = [...rowData];
        newRowData[index].text[rowIndex].splice(columIndex, 1);
        console.log('newRowData:', newRowData);
        setRowData(newRowData);
        rowDataHandler?.(newRowData);
    }

    const titleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newRowData = [...rowData];
        newRowData[index].title = e.target.value;
        setRowData(newRowData);
        rowDataHandler?.(newRowData);
    }
    const subTitleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, subIndex: number) => {
        const newRowData = [...rowData];
        newRowData[index].subTitle[subIndex].title = e.target.value;
        setRowData(newRowData);
        rowDataHandler?.(newRowData);
    }
    const rowValueInputOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, rowIndex: number, columIndex: number) => {
        const newRowData = [...rowData];
        newRowData[index].text[rowIndex][columIndex].text = e.target.value;
        setRowData(newRowData);
        rowDataHandler?.(newRowData);
    }

    useEffect(() => {
        rowDataHandler?.(rowData);
    }, []);
    const divStyle = {
        display: 'flex',
        marginBottom: '20px',
        gap: '5px'
    }
    return (
        <div>
            {rowData.map((data, index) => {
                return (
                    <div key={index} style={{marginBottom: '20px'}}>
                        <div style={{display: 'flex', marginBottom: '20px',gap:'5px'}}>
                            <Button variant="contained" onClick={() => addRow()}>구분 추가</Button>
                            <Button variant="contained" onClick={() => deleteRow(index)}>구분제거</Button>
                        </div>
                        {/* title */}
                        <div style={{display: 'flex', marginBottom: '20px'}}>
                            <h2 style={{marginRight: '20px'}}>구분</h2>
                            <Input type={'text'} value={data.title}
                                   onChange={e => titleInputOnChange(e, index)}/>

                        </div>
                        {/* title */}
                        {/* column */}
                        <div style={{display: 'flex', marginBottom: '20px'}}>
                            <Button variant="contained" onClick={() => addSubTitle(index)}>컬럼 추가</Button>
                        </div>
                        <div style={divStyle}>
                            <Button variant="outlined"></Button>
                            {data.subTitle.map((sub, subIndex) => {
                                return (
                                    <div key={subIndex} style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                        <Input type={'text'} value={sub.title}
                                               onChange={e => subTitleInputOnChange(e, index, subIndex)}/>
                                        <Button variant="outlined"
                                                onClick={() => deleteSubTitle(index, subIndex)}>X</Button>
                                    </div>
                                )
                            })}
                        </div>
                        {/* column */}
                        {/* row */}
                        <div style={{display: 'flex', marginBottom: '20px'}}>
                            <Button variant="contained" onClick={() => addText(index)}>행 추가</Button>
                        </div>
                        {data.text.map((text, textIndex) => {
                            return (
                                <div key={textIndex} style={divStyle}>
                                    <Button variant="outlined"
                                            onClick={() => deleteText(index, textIndex)}>X</Button>
                                    {text.map((t, tIndex) => {
                                        return (
                                            <div key={tIndex}
                                                 style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                                <Input type={'text'} value={t.text}
                                                       onChange={e => rowValueInputOnChange(e, index, textIndex, tIndex)}/>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                        {/* row */}
                    </div>
                )
            })}
            <button onClick={() => console.log('rowData:', rowData)}>콘솔</button>
            <button onClick={addRow}>행 추가</button>
        </div>
    )
}

export default QualificationItem;