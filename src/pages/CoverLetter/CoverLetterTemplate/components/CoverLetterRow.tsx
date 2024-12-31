
interface Props{
    content?: RowData;
}
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
    text:string;
    colspan:number;
}
const CoverLetterRow = ({ content }:Props) => {
    if(!content) return null;
    return (
        <>
            <tr>
                <td colSpan={10}>{content.title}</td>
            </tr>
            <tr>
                {content.subTitle.map((item) =>
                    <td key={item.id}
                        // colSpan={item.colspan}
                    >{item.title}</td>
                )}
            </tr>
            {content.text.map((item,index) =>
                <tr key={index}>
                    {item.map((text) =>
                        (<td key={text.id}
                             // colSpan={text.colspan}
                        >{text.text}</td>))}
                </tr>
            )}
        </>
    );
}

export default CoverLetterRow;