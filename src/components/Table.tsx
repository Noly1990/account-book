import React, { useEffect, useState } from "react";
import HeaderCol, { SortType } from "./HeaderCol";


export interface ColumnItem {
    /**
     * 数据内的key名
     */
    dataKey: string,


    /**
     * 唯一标识
     */
    key: string

    /**
     * 表头的展示名称
     */
    title: string,

    /**
     * 该项是否支持排序，默认按值大小排序，需要为number可惜
     */
    sorter?: (a: any, b: any) => any,

    onFilter?: (values: any[], record: any) => boolean

    render?: (value: any, record?: any) => JSX.Element

    /**
     * 表头的筛选组
     */
    filters?: object[],

    /**
     * 筛选是否支持多选
     */
    filterMultiple?: boolean;


}

function Table(props: {
    columns: ColumnItem[],
    dataSource: object[]
}) {

    const { columns, dataSource } = props;

    useEffect(() => {
        setData(dataSource)
    }, [dataSource])

    const [innerData, setData] = useState(dataSource || [])

    const [filters, setFilters] = useState<any>({})

    function onFilter(key: string, filter: any, values: any[]) {

        filters[key] = {
            filter,
            values
        }

        if (values.length === 0) {
            delete filters[key]
        }

        setFilters(filters)
        let newData = dataSource;
        for (let key in filters) {
            newData = newData.filter((v) => filters[key].filter(filters[key].values, v))
        }

        setData(newData)
    }

    function onSort(key: string, sorter: any, sortType: SortType) {
        const newData = sortType === 'none' ? innerData : [...innerData].sort(sorter);
        if (sortType === 'down') {
            newData.reverse()
        }
        setData(newData)
    }

    const [income, setIncome] = useState(0);

    const [expense, setExpense] = useState(0);

    const [statistics, setStat] = useState([])

    function clickToStatistics() {
        
    }

    useEffect(() => {
        let tempIn = 0;
        let tempOut = 0;

        innerData.forEach((v: any) => {
            tempIn += v.type === 1 ? v.amount : 0;

            tempOut += v.type === 0 ? v.amount : 0;
        })
        setIncome(tempIn)
        setExpense(tempOut)
    }, [
        innerData
    ])
    return (
        <table style={{
            width: '100%'
        }}>
            <thead>
                <tr style={{ display: "flex" }}>
                    {columns.map((c: ColumnItem, i: number) => <HeaderCol filter={c.onFilter} handleSort={onSort} handleFilter={onFilter} dataKey={c.dataKey} filters={c.filters} sorter={c.sorter} key={`${c.key}${i}`}>{c.title}</HeaderCol>)}
                </tr>
            </thead>
            <tbody>
                <tr style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
                    <td style={{ flex: 1 }}>当前收入：{income}</td>
                    <td style={{ flex: 1 }}>当前支出：{expense}</td>
                    <td style={{ flex: 1 }}><button onClick={clickToStatistics}>分类统计</button></td>
                </tr>
                {
                    innerData.length > 0 ? innerData.map((v: any, i: number) => {
                        return (<tr key={'row' + i} style={{ display: "flex" }}>
                            {columns.map((c: ColumnItem, ii) => <td key={'data' + i + '-' + ii} style={{ flex: 1 }}>{
                                c.render ? c.render(v[c.dataKey], v) : v[c.dataKey].toString()
                            }</td>)}
                        </tr>)
                    }) : <tr><td>没有数据</td></tr>
                }
            </tbody>
        </table>
    )
}

export default Table;