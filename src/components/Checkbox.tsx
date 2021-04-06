import { useState } from "react";


export interface CheckboxProps {
    checked?: boolean,
    title: string,
    value: any,
    size?: number,
    onChange?: (v: any, checked: boolean) => void
}

function Checkbox(props: CheckboxProps) {
    const [checked, setChecked] = useState(props.checked || false);
    const { size = 16 } = props;

    function onChange(e: any) {
        setChecked(!checked)
    }
    return (
        <div style={{ padding: 4 }}>
            <input style={{
                width: size,
                height: size
            }} onChange={props.onChange ? (e) => {
                if (props.onChange) props.onChange(props.value, e.target.checked)
                setChecked(e.target.checked)
            } : onChange} checked={props.checked || checked} type="checkbox" id={props.title} value={props.value} />
            <label style={{
                fontSize: size
            }} htmlFor={props.title}>{props.title}</label>
        </div>
    )
}

export default Checkbox;