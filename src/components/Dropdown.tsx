import React, { cloneElement } from "react";


/**
 * 默认点击触发
 * @param props 
 * @returns 
 */
function Dropdown(props: {
    content: JSX.Element,
    children: any,
    handleVisible: any,
    visible: boolean;
    disabled?: boolean
}) {

    const child = React.Children.only(props.children) as React.ReactElement<any>;

    const dropdownTrigger = cloneElement(child, {
        disabled: props.disabled,
    });

    function Trigger() {
        return (
            <div onClick={(e) => {
                props.handleVisible(!props.visible)
                e.stopPropagation()
            }} style={{ display: 'inline-block' }}>
                {dropdownTrigger}
            </div>)
    }

    function Popup() {
        return (
            <div style={{
                display: "block",
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
                props.visible && <Popup />
            }
            {<Trigger />}
        </div>
    )
}

export default Dropdown;