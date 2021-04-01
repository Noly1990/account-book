import { ArrowUpOutlined, FilterOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Checkbox from "./Checkbox";
import CheckboxGroup from "./CheckboxGroup";
import Dropdown from "./Dropdown";

function HeaderCol(props: {
    children: any,
    allowSort: boolean
    allowFilter: boolean
}) {

    const [visiblle, setVisible] = useState(false)

    return (
        <th style={{ flex: 1 }}>
            <ArrowUpOutlined style={{ display: 'inline-block', height: 30, width: 30 }} />
            {props.children}
            <Dropdown visible={visiblle} content={
                <div>
                    <CheckboxGroup onChange={(v) => {
                        console.log(v)
                    }} value={[1, 2]}>
                        <Checkbox title="一月" value={1} />
                        <Checkbox title="二月" value={2} />
                        <Checkbox title="三月" value={3} />
                    </CheckboxGroup>
                    <div>
                        <button onClick={() => { setVisible(false) }} style={{ margin: 3 }}>取消</button>
                        <button onClick={() => {
                            setVisible(false)
                        }} style={{ margin: 3 }}>确认</button>
                    </div>
                </div>
            }>
                <FilterOutlined onClick={() => {
                    setVisible(true)
                }} style={{ display: 'inline-block', height: 30, width: 30 }} />
            </Dropdown>

        </th>
    );
}

export default HeaderCol