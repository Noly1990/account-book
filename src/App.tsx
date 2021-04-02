
import React, { useEffect, useState } from 'react';
import { parse } from 'papaparse'

import './App.css';
import { fileExt, formatDate } from './tool';
import Table from './components/Table';
import { bills, categories } from './csv/data';
import Modal from './components/Modal';
import MyWebGL from './components/MyWebGL';

interface DataItem {
  time: Date,
  type: 0 | 1,
  category: string,
  amout: number, // float
}

interface CategoryItem {
  id: string,
  name: string,
  type: 0 | 1,
}

function App() {

  const [data, setData] = useState<DataItem[]>([])

  const [dataSource, setDataSource] = useState<any[]>([])

  const [cateFilters, setFilters] = useState<any>([])

  const [category, setCate] = useState<undefined | Map<string, CategoryItem>>(undefined)

  const [modalV, setModalV] = useState(false)

  const [newItem, setNewItem] = useState({
    ope: 'add',
    time: new Date(),
    type: 0,
    category: '',
    amount: 0,
    id: 0
  })

  function autoLoad() {
    setData(processData(bills))
    const map = processCategory(categories).reduce((p: Map<string, CategoryItem>, v: CategoryItem) => {
      p.set(v.id, v)
      return p;
    }, new Map())
    setCate(map)

    setFilters(Array.from(map).map(v => v[1]).map(v => { return { title: v.name, value: v.id } }))

  }

  function processData(data: any[]): DataItem[] {
    if (!data || data.length === 0 || data.length === 1) {
      alert('表格为空')
      return []
    }
    const title: string[] = data[0];
    const d: DataItem[] = []
    for (let index = 1; index < data.length; index++) {
      const element = data[index];
      const temp = title.reduce((p: { [key: string]: any }, v: string, i: number) => {
        if (v === 'time') {
          p[v] = new Date(parseInt(element[i]))
        } else if (v === 'amount') {
          p[v] = parseFloat(element[i])
        } else if (v === 'type') {
          p[v] = parseInt(element[i])
        } else {
          p[v] = element[i]
        }
        return p;
      }, {})
      temp.id = index
      d.push(temp as DataItem)
    }
    return d;
  }

  function processCategory(data: any[]): CategoryItem[] {
    if (!data || data.length === 0 || data.length === 1) {
      alert('表格为空')
      return []
    }
    const title: string[] = data[0]
    const d: CategoryItem[] = [];
    for (let index = 1; index < data.length; index++) {
      const element = data[index];
      const temp = title.reduce((p: { [key: string]: any }, v: string, i: number) => {
        p[v] = element[i]
        return p;
      }, {})

      d.push(temp as CategoryItem)
    }
    return d
  }


  function onDataChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (fileExt(e.target.value) !== '.csv') {
      e.target.value = ''
      alert('请选择一个正确的csv文件')
      return
    }

    if (e.target.files?.length === 0) {
      alert('没有文件')
      return
    }
    const file = e.target.files ? e.target.files[0] : null
    if (!file) {
      alert("没有文件数据")
      return
    }
    const reader = new FileReader()
    reader.onerror = (e) => {
      console.error(e.target?.error)
      alert('文档处理出错')
    }
    reader.readAsText(file, 'utf-8')

    reader.onloadend = (e) => {
      const res = parse(e.target?.result as string);
      if (res.errors && res.errors.length > 0) {
        alert('处理出错')
        return
      }
      console.log(res.data)
      setData(processData(res.data))
    }

  }

  function onCategoryChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (fileExt(e.target.value) !== '.csv') {
      e.target.value = ''
      alert('请选择一个正确的csv文件')
    }

    if (e.target.files?.length === 0) {
      alert('没有文件')
      return
    }

    const file = e.target.files ? e.target.files[0] : null
    if (!file) {
      alert("没有文件数据")
      return
    }
    const reader = new FileReader()
    reader.onerror = (e) => {
      console.error(e.target?.error)
      alert('文档处理出错')
    }

    reader.readAsText(file, 'utf-8')
    reader.onloadend = (e) => {
      const res = parse(e.target?.result as string);
      if (res.errors && res.errors.length > 0) {
        alert('处理出错')
        return
      }

      console.log(res.data)
      const map = processCategory(res.data)?.reduce((p: Map<string, CategoryItem>, v: CategoryItem) => {
        p.set(v.id, v)
        return p;
      }, new Map())

      setCate(map)

    }

  }

  function addNewItem() {

    if (newItem.category === '') {
      alert('请选择分类')
      return
    }
    if (newItem.amount === 0) {
      alert('请输入账单金额')
      return
    }

    if (newItem.ope === 'add') {
      newItem.id = dataSource.length + 1;

      setDataSource([...dataSource, newItem])
    } else {
      for (let i = 0; i < dataSource.length; i++) {
        if (dataSource[i].id === newItem.id) {
          dataSource[i] = newItem
        }
      }
      setDataSource([...dataSource])
    }

    setModalV(false)


  }






  useEffect(() => {
    if (data.length > 0 && category) {
      setDataSource(data)
    }
  }, [data, category])

  return (
    <div className="App">
      <div style={{
        marginTop: 50,
        display: 'flex',
      }}>
        <div style={{ flex: 1 }}>
          请选择账单文件：<input onClick={(e: any) => { e.target.value = null }} onChange={onDataChange} type="file" placeholder="请选择账单数据" accept=".csv" />
        </div>
        <div style={{ flex: 1 }}>
          请选择分类文件： <input onChange={onCategoryChange} type="file" onClick={(e: any) => { e.target.value = null }} placeholder="请选择分类数据" accept=".csv" />
        </div>
        <div style={{ flex: 1 }}>
          <button onClick={autoLoad}>一键加载</button>

          <button style={{ marginLeft: 6 }} onClick={() => {
            setNewItem({
              id: 0,
              type: 0,
              time: new Date(),
              category: '',
              amount: 0,
              ope: 'add'
            })
            setModalV(true)
          }}>新增账单</button>

          <button style={{ marginLeft: 6 }} onClick={() => {

          }}>新增分类</button>
        </div>
      </div>
      <Modal width={500} title={newItem.ope === 'add' ? "新增账单" : "修改账单"} visible={modalV}>
        <div>
          <div style={{ display: 'flex', marginTop: 20 }}>
            <div style={{ flex: 1 }} >
              <label htmlFor="type">账单类型：</label>
              <input type="radio" id="0" name="type" value={0} onChange={(e) => {
                setNewItem({
                  ...newItem,
                  type: parseInt(e.target.value)
                })
              }} checked={newItem.type === 0} />
              <label htmlFor="0">支出</label>
              <input type="radio" id="1" name="type" value={1} onChange={(e) => {
                setNewItem({
                  ...newItem,
                  type: parseInt(e.target.value)
                })
              }} checked={newItem.type === 1} />
              <label htmlFor="1">收入</label>
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="category">账单分类：</label>
              <select value={newItem.category} onChange={(e) => {
                setNewItem({
                  ...newItem,
                  category: e.target.value
                })
              }} id="category" name="category" placeholder="请选择账单类型">
                <option value="">请选择账单类型</option>
                {
                  cateFilters.map((v: any) => <option key={v.value} value={v.value}>{v.title}</option>)
                }

              </select>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: 20 }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="time">账单日期：</label>
              <input id="time" style={{ width: 140 }} value={formatDate(newItem.time)} onChange={(e) => {
                const d = new Date(e.target.value)
                d.setHours(12)
                setNewItem({
                  ...newItem,
                  time: d
                })
              }} type="date" />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="amount">账单金额：</label>
              <input style={{ width: 140 }} onChange={(e) => {
                setNewItem({
                  ...newItem,
                  amount: parseFloat(e.target.value),
                })
              }} value={newItem.amount} id="amount" type="number" />
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <button onClick={() => {
            setModalV(false)
          }}>取消</button>
          <button style={{ margin: 10 }} onClick={addNewItem}>确认</button>
        </div>
      </Modal>

      <div style={{ display: 'flex' }}>
        <div style={{
          marginLeft: 100,
          marginRight: 100,
          marginBottom: 50,
          flex: 3
        }}>
          <Table dataSource={dataSource} columns={[
            {
              dataKey: 'time',
              key: 'time',
              title: '账单时间',
              sorter: (a: any, b: any) => a.time.getTime() - b.time.getTime(),
              onFilter: (values: any[], record: DataItem) => values.includes(record.time.getMonth()),
              filters: [
                { value: 0, title: '一月' },
                { value: 1, title: '二月' },
                { value: 2, title: '三月' },
                { value: 3, title: '四月' },
                { value: 4, title: '五月' },
                { value: 5, title: '六月' },
                { value: 6, title: '七月' },
                { value: 7, title: '八月' },
                { value: 8, title: '九月' },
                { value: 9, title: '十月' },
                { value: 10, title: '十一月' },
                { value: 11, title: '十二月' },
              ],
              render: (v: Date) => {
                return (<span>{v.toLocaleDateString()}</span>)
              }
            },
            {
              dataKey: 'type',
              key: 'type',
              title: '账单类型',
              onFilter: (values: any[], record: DataItem) => values.includes(record.type),
              filters: [{ value: 0, title: '支出' }, { value: 1, title: '收入' }],
              render: (v: any) => {
                return v === 0 ? (<span>支出</span>) : (<span>收入</span>)
              }
            },
            {
              dataKey: 'category',
              filters: cateFilters,
              key: 'category',
              title: '账单分类',
              render: (v: any) => {
                return <span>{category?.get(v)?.name}</span>
              },
              onFilter: (values: any[], record: DataItem) => values.includes(record.category),
            },
            {
              dataKey: 'amount',
              sorter: (a: any, b: any) => a.amount - b.amount,
              key: 'amount',
              title: '账单金额',
            },
            {
              title: '操作',
              dataKey: 'operation',
              key: 'operation',
              render: (v: any, record: any) => <div>
                <button onClick={() => {
                  setNewItem({
                    ...record,
                    ope: 'modify',
                  })
                  setModalV(true);

                }} style={{ backgroundColor: 'white', border: 'none' }}>修改</button>

                <button onClick={() => {
                  setDataSource(dataSource.filter((v) => v.id !== record.id))
                }} style={{ marginLeft: 5, backgroundColor: 'red', color: 'white', border: 'none' }}>删除</button>
              </div>
            }
          ]} />
        </div>
        <div style={{ flex: 2 }}>
          <MyWebGL />
        </div>
      </div>





    </div>
  );
}

export default App;
