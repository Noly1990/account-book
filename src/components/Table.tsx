import React, { useEffect, useState } from "react";
import HeaderCol, { SortType } from "./HeaderCol";
import Modal from "./Modal";


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
    dataSource: object[],
    cateMap: any
}) {

    const { columns, dataSource, cateMap } = props;

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

    const [statistics, setStat] = useState<{ category: string, amount: number, id: string, type: string }[]>([])

    const [statType, setStatType] = useState('支出')

    const [visible, setVisible] = useState(false);

    function clickToStatistics() {
        const values: any = {}

        innerData.forEach((v: any) => {
            if (values[v.category] === undefined) {
                values[v.category] = v.amount
            } else {
                values[v.category] += v.amount
            }
        })
        let temp = []
        for (let key in values) {
            temp.push({
                id: key,
                category: cateMap.get(key).name,
                type: cateMap.get(key).type === 0 ? '支出' : '收入',
                amount: values[key]
            })
        }
        temp.sort((a, b) => b.amount - a.amount)
        setStat(temp)

        setVisible(true)
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
        <div>
            <Modal title="统计分析" visible={visible}>
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>
                            分类
                        </div>
                        <div style={{ flex: 1 }}>
                            收支类型
                        </div>
                        <div style={{ flex: 1 }}>
                            金额
                        </div>
                    </div>
                    {
                        statistics.length > 0 ? statistics.filter((v) => v.type === statType).map((v) =>
                            <div style={{ display: 'flex', marginTop: 6 }} key={v.id}>
                                <div style={{ flex: 1 }}>
                                    {v.category}
                                </div>
                                <div style={{ flex: 1 }}>
                                    {v.type}
                                </div>
                                <div style={{ flex: 1 }}>
                                    {v.amount}
                                </div>
                            </div>) : <div>无数据</div>
                    }
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, margin: 8 }}>
                    <button onClick={() => {
                        setStatType(statType === '支出' ? '收入' : '支出')
                    }}>{statType === '支出' ? '收入' : '支出'}</button>
                    <button style={{ marginLeft: 8 }} onClick={() => {
                        setVisible(false)
                    }}>确认</button>
                </div>
            </Modal>
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
                                {columns.map((c: ColumnItem, ii) => <td key={'col' + i + '-' + ii} style={{ flex: 1 }}>{
                                    c.render ? c.render(v[c.dataKey], v) : v[c.dataKey].toString()
                                }</td>)}
                            </tr>)
                        }) : <tr><td>没有数据</td></tr>
                    }
                </tbody>
            </table>
        </div>

    )
}

export default Table;