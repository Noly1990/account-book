import { useEffect, useState } from "react";

export interface ModalProps {
    visible?: boolean;
    width?: number | string,
    title?: string,
    children: any
}

function Modal(props: ModalProps) {

    const [visible, setVisible] = useState(props.visible)

    useEffect(() => {
        setVisible(props.visible)
    }, [props.visible])

    return (
        <div style={{
            width: props.width || 300,
            minHeight: 200,
            display: visible ? "block" : 'none',
            position: 'fixed',
            top: '30%',
            left: '50%',
            border: '1px solid #999',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            zIndex: 10
        }}>
            <div style={{
                marginTop: 10
            }}>{props.title}</div>
            {props.children}

        </div>
    )
}

export default Modal;