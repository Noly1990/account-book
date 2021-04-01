import { cloneElement, useState } from "react";

function CheckboxGroup(props: {
    children: JSX.Element[],
    value?: any
    defaultValue?: any
    onChange?: (value: any[]) => void
}) {

    const [value, setValue] = useState<any[]>(props.value || props.defaultValue || [])

    function handleChildChecked(childValue: any, checked: boolean) {
        const has = value.includes(childValue);
        const newValue = checked && !has ? value.concat([childValue]) : value.filter(v => v !== childValue)
        setValue(newValue)
        if (props.onChange) props.onChange(newValue)
    }

    return (
        <div>
            {
                props.children.map(v => {
                    return cloneElement(v, {
                        key: v.props.value,
                        checked: value.indexOf(v.props.value) > -1,
                        onChange: handleChildChecked
                    });
                })
            }
        </div>
    )
}

export default CheckboxGroup;