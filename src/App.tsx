
import React, { useEffect, useState } from 'react';
import { parse } from 'papaparse'

import './App.css';
import { fileExt } from './tool'; 
import Table from './components/Table';

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

  const [category, setCate] = useState<undefined | Map<string, CategoryItem>>(undefined)

  function autoLoad() {

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


      const map = processCategory(res.data)?.reduce((p: Map<string, CategoryItem>, v: CategoryItem) => {
        p.set(v.id, v)
        return p;
      }, new Map())


      setCate(map)

    }

  }

  useEffect(() => {
    if (data.length > 0 && category) {
      setDataSource(data.map((v) => {
        v.category = category.has(v.category) ? category.get(v.category)?.name || '未分类' : '未分类';
        return v
      }))
    }
  }, [data, category])
  return (
    <div className="App">
      <div style={{
        marginTop: 50,
        display: 'flex',
      }}>
        <div style={{ flex: 1 }}>
          请选择数据文件：<input onClick={(e: any) => { e.target.value = null }} onChange={onDataChange} type="file" placeholder="请选择账单数据" accept=".csv" />
        </div>
        <div style={{ flex: 1 }}>
          请选择分类文件： <input onChange={onCategoryChange} type="file" onClick={(e: any) => { e.target.value = null }} placeholder="请选择分类数据" accept=".csv" />
        </div>
        <div style={{ flex: 1 }}>
          <button onClick={autoLoad}>一键加载</button>
        </div>
      </div>


      <div style={{
        marginLeft: 100,
        marginRight: 100,
      }}>
        <Table dataSource={dataSource} columns={[
          {
            dataKey: 'time',
            key: 'time',
            title: '账单时间',
            render: (v: Date) => {
              return (<span>{v.toLocaleString()}</span>)
            }
          },
          {
            dataKey: 'type',
            key: 'type',
            title: '账单类型',
            render: (v: any) => {
              return v === 0 ? (<span>支出</span>) : (<span>收入</span>)
            }
          },
          {
            dataKey: 'category',
            key: 'category',
            title: '账单分类',
          },
          {
            dataKey: 'amount',
            key: 'amount',
            title: '账单金额',
          },
        ]} />
      </div>


    </div>
  );
}

export default App;
