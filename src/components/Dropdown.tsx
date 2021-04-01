import React, { cloneElement, useEffect, useState } from "react";


/**
 * 默认点击触发
 * @param props 
 * @returns 
 */
function Dropdown(props: {
    content: JSX.Element,
    children: any,
    visible?: boolean;
    disabled?: boolean
}) {

    const [visible, setVisible] = useState(props.visible || false);

    const child = React.Children.only(props.children) as React.ReactElement<any>;

    const dropdownTrigger = cloneElement(child, {
        disabled: props.disabled,
    });


    useEffect(() => {
        setVisible(props.visible || false)
    }, [props.visible])


    function Trigger() {
        return (
            <div onClick={(e) => {
                setVisible(!visible)
                e.stopPropagation()
            }} style={{ display: 'inline-block' }}>
                {dropdownTrigger}
            </div>)
    }

    function Popup() {
        return (
            <div style={{
                display: visible ? 'block' : 'none',
                position: 'absolute',
                width: 100,
                right: 0,
                backgroundColor: 'white',
                top: 25,
                border: '1px solid black'
            }}>
                {props.content}
            </div>
        )
    }

    return (
        <div style={{ display: 'inline-block', position: 'relative' }}>
            {
                visible ? <Popup /> : null
            }
            {<Trigger />}
        </div>
    )
}

export default Dropdown;