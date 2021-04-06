import { cloneElement, useState } from "react";

function CheckboxGroup(props: {
    children?: JSX.Element[] | null,
    value?: any
    defaultValue?: any
    onChange?: (value: any[]) => void
}) {

    const [value, setValue] = useState<any[]>(props.value || props.defaultValue || [])

    function handleChildChecked(childValue: any, checked: boolean) {
        const withValue = value.includes(childValue);
        const newValue = checked && !withValue ? value.concat([childValue]) : value.filter(v => v !== childValue)
        setValue(newValue)
        if (props.onChange) props.onChange(newValue)
    }

    return (
        <div>
            {
                props.children && props.children.map(v => {
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