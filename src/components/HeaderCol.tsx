import { FilterOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Checkbox from "./Checkbox";
import CheckboxGroup from "./CheckboxGroup";
import Dropdown from "./Dropdown";
import SortTrigger from "./SortTrigger";

export type SortType = 'none' | 'up' | 'down';

function HeaderCol(props: {
    handleFilter: (key: string, filter: any, values: any[]) => void
    handleSort: (key: string, sorter: any, sortType: SortType) => void
    dataKey: string,
    children: any,
    sorter?: (a: any, b: any) => any,
    filter?: any,
    filters?: any[]
}) {

    const [visiblle, setVisible] = useState(false)
    const [status, setStatus] = useState<SortType>('none');
    const [value, setValue] = useState([])
    return (
        <th style={{ flex: 1, cursor: 'pointer', userSelect: 'none' }}>
            { !props.sorter || <SortTrigger onClick={() => {
                const newStatus = status === 'none' ? 'up' : status === 'up' ? 'down' : 'none'
                setStatus(newStatus)
                props.handleSort(props.dataKey, props.sorter, newStatus)
            }} status={status} />}

            <span onClick={() => {
                if (!props.sorter) return
                const newStatus = status === 'none' ? 'up' : status === 'up' ? 'down' : 'none'
                setStatus(newStatus)
                props.handleSort(props.dataKey, props.sorter, newStatus)
            }} style={{ marginLeft: 6, position: 'relative', top: 5 }}>
                {props.children}
            </span>
            {
                !props.filters || <Dropdown handleVisible={() => {
                    setVisible(!visiblle)
                }} visible={visiblle} content={
                    <div>
                        <CheckboxGroup onChange={(v: any) => {
                            setValue(v)
                        }} value={value}>
                            {
                                props.filters && props.filters.length > 0 ?
                                    props.filters.map((v: any) => <Checkbox key={v.value} title={v.title} value={v.value} />) :
                                    undefined
                            }

                        </CheckboxGroup>
                        <div>
                            
                            <button onClick={() => { setVisible(false) }} style={{ margin: 3 }}>取消</button>
                            <button onClick={() => {
                                setVisible(false)
                                props.handleFilter(props.dataKey, props.filter, value)
                            }} style={{ margin: 3 }}>确认</button>
                        </div>
                    </div>
                }>
                    <FilterOutlined onClick={() => {
                        setVisible(true)
                    }} style={{ display: 'inline-block', marginLeft: 3, height: 30, width: 30, position: 'relative', top: 5 }} />
                </Dropdown>
            }


        </th>
    );
}

export default HeaderCol