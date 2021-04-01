import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import React from "react";

function SortTrigger(props: {
    status: 'up' | 'down' | 'none',
    onClick?: any
}) {
    return (
        <div onClick={props.onClick} style={{ display: 'inline-block' }}>
            <div style={{ display: 'flex', flexDirection: "column" }}>
                <CaretUpOutlined style={{ flex: 1, color: props.status === 'up' ? '#1890ff' : 'black' }} />
                <CaretDownOutlined style={{ flex: 1, color: props.status === 'down' ? '#1890ff' : 'black' }} />
            </div>

        </div>

    )
}

export default SortTrigger;