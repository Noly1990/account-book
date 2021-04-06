import React, { useEffect, useState } from "react";
import { CategoryItem } from "../App";
import Flex from "../Layout/Flex";
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
    filters?: { value: any, title: string }[],

    /**
     * 筛选是否支持多选
     */
    filterMultiple?: boolean;


}

function Table(props: {
    columns: ColumnItem[],
    dataSource: object[],
    cateMap: Map<string, CategoryItem>
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
        const temp = []
        for (let key in values) {
            temp.push({
                id: key,
                category: cateMap.get(key)?.name || '未定义',
                type: cateMap.get(key)?.type === 0 ? '支出' : '收入',
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
                    <Flex>
                        <Flex.Item>
                            分类
                        </Flex.Item>
                        <Flex.Item>
                            收支类型
                        </Flex.Item>
                        <Flex.Item>
                            金额
                        </Flex.Item>
                    </Flex>
                    {
                        statistics.length > 0 ? statistics.filter((v) => v.type === statType).map((v) =>
                            <Flex style={{ marginTop: 6 }} key={v.id}>
                                <Flex.Item>
                                    {v.category}
                                </Flex.Item>
                                <Flex.Item>
                                    {v.type}
                                </Flex.Item>
                                <Flex.Item>
                                    {v.amount}
                                </Flex.Item>
                            </Flex>) : <div>无数据</div>
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
            <Flex style={{ marginTop: 10, marginBottom: 10 }}>
                <Flex.Item>当前收入：{income}</Flex.Item>
                <Flex.Item>当前支出：{expense}</Flex.Item>
                <Flex.Item><button onClick={clickToStatistics}>分类统计</button></Flex.Item>
            </Flex>
            <table style={{
                width: '100%'
            }}>

                <thead>
                    <tr style={{ display: "flex" }}>
                        {columns.map((c: ColumnItem, i: number) => <HeaderCol filter={c.onFilter} handleSort={onSort} handleFilter={onFilter} dataKey={c.dataKey} filters={c.filters} sorter={c.sorter} key={`${c.key}${i}`}>{c.title}</HeaderCol>)}
                    </tr>
                </thead>
                <tbody>

                    {
                        innerData.length > 0 ? innerData.map((v: any, i: number) => {
                            return (<tr key={'row' + i} style={{ display: "flex" }}>
                                {columns.map((c: ColumnItem, ii) => <td style={{ flex: 1 }} key={'col' + i + '-' + ii}>{
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