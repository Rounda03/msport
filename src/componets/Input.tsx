import '../css/input.css';

interface Props {
    type: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    placeholder?: string;
    label?: string;
    flex?: number;
    height?: number;
    width?: number;
}

const Input = ({type, placeholder = '', name = '', onChange, label, flex = 1,height,width}: Props) => {
    return (
        <div style={{flex: flex}}>
            {label&&<p className={'title'}><label>{label}</label></p>}
            <input
                className="custom-input"
                type={type}
                placeholder={placeholder}
                name={name}
                onChange={onChange}
                style={{height:height,width:width}}
            />
        </div>
    );
}

export default Input;