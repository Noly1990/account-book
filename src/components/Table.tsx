import React from "react";
import HeaderCol from "./HeaderCol";


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
    sorter?: (a: any, b: any) => boolean,

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

    return (
        <table style={{
            marginTop: 20,
            width: '100%'
        }}>
            <thead>
                <tr style={{ display: "flex" }}>
                    {columns.map((c: ColumnItem, i: number) => <HeaderCol allowFilter={!!c.filters} allowSort={!!c.sorter} key={`${c.key}${i}`}>{c.title}</HeaderCol>)}
                </tr>
            </thead>
            <tbody>
                {
                    dataSource && dataSource.length > 0 ? dataSource.map((v: any, i: number) => {

                        return (<tr key={'row' + i} style={{ display: "flex" }}>
                            {columns.map((c: ColumnItem, ii) => <td key={'data' + i + '-' + ii} style={{ flex: 1 }}>{
                                c.render ? c.render(v[c.dataKey]) : v[c.dataKey].toString()
                            }</td>)}
                        </tr>)
                    }) : <tr><td>没有数据</td></tr>
                }
            </tbody>
        </table>
    )
}

export default Table;