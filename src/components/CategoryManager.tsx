import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Modal from "./Modal";

function CategoryManager(props: {
    category: Map<string, any>,
    handleCategory: (category: Map<string, any>) => void
}) {

    const {category ,handleCategory} = props

    const [newCate, setNewCate] = useState({
        ope: 'add',
        id: '',
        type: 0,
        name: '',
    })

    const [visible, setVisible] = useState(false);

    function addNewCate() {
        if (newCate.name.length < 1) {
            alert('请输入分类名称')
            return
        }

        if (newCate.ope === 'add') {
            let randomId = ''
            while(true) {
                 randomId = Math.random().toString(32).slice(2);
                if (!category.has(randomId)) break
            }
            category.set(randomId, {
                id: randomId,
                name: newCate.name,
                type: newCate.type
            })
        } else {
            category.set(newCate.id, {
                id: newCate.id,
                name: newCate.name,
                type: newCate.type
            })
        }


        handleCategory(category)

        setVisible(false)
    }


    function deleteCate(id: string) {
        category.delete(id)

        handleCategory(category)
    }

    return (
        <div style={{ marginTop: 20 }}>
            <Modal title={newCate.ope === 'add' ? "新增分类" : "修改分类"} width={400} visible={visible}>
                <div style={{ display: 'flex', marginTop: 20 }}>
                    <div style={{ flex: 1 }} >
                        <label htmlFor="ctype">收支类型：</label>
                        <input type="radio" id="0" name="ctype" value={0} onChange={(e) => {
                            setNewCate({
                                ...newCate,
                                type: parseInt(e.target.value)
                            })
                        }} checked={newCate.type === 0} />
                        <label htmlFor="0">支出</label>
                        <input type="radio" id="1" name="ctype" value={1} onChange={(e) => {
                            setNewCate({
                                ...newCate,
                                type: parseInt(e.target.value)
                            })
                        }} checked={newCate.type === 1} />
                        <label htmlFor="1">收入</label>
                    </div>
                </div>
                <div style={{ marginTop: 20 }}>
                    <label htmlFor="category">分类名称：</label>
                    <input onChange={(e) => {
                        setNewCate({
                            ...newCate,
                            name: e.target.value
                        })
                    }} name="category" type="text" minLength={1} maxLength={10} value={newCate.name} />
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
                    <button onClick={() => {
                        setVisible(false)
                    }}>取消</button>
                    <button style={{ margin: 10 }} onClick={addNewCate}>确认</button>
                </div>
            </Modal>
            <div style={{ display: 'flex' }} key='title'>

                <div style={{ flex: 1 }}>
                    序号
                </div>
                <div style={{ flex: 1 }}>
                    ID
                </div>
                <div style={{ flex: 1 }}>
                    收支类型
                </div>
                <div style={{ flex: 1 }}>
                    分类名称
                </div>
                <div style={{ flex: 1 }}>
                    操作
                </div>
            </div>
            {
                Array.from(props.category).map((v, i) =>
                    <div style={{ display: 'flex', marginTop: 8 }} key={v[0]}>

                        <div style={{ flex: 1 }}>
                            {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                            {v[1].id}
                        </div>
                        <div style={{ flex: 1 }}>
                            {v[1].type === 0 ? '支出' : '收入'}
                        </div>
                        <div style={{ flex: 1 }}>
                            {v[1].name}
                        </div>
                        <div style={{ flex: 1 }}>
                            <button onClick={() => {
                                setNewCate({
                                    id: v[1].id,
                                    type: v[1].type,
                                    name: v[1].name,
                                    ope: 'modify',
                                })

                                setVisible(true)
                            }}>修改</button>
                            <button onClick={() => {
                                deleteCate(v[0])
                            }} style={{ marginLeft: 5, backgroundColor: 'red', color: 'white', border: 'none' }}>删除</button>
                        </div>
                    </div>)
            }
            <div>

                <div style={{ display: 'flex', marginTop: 15 }} key='title'>

                    <div style={{ flex: 1 }}>

                    </div>
                    <div style={{ flex: 1 }}>

                    </div>
                    <div style={{ flex: 1 }}>
                        <button onClick={() => {
                            setVisible(true)
                        }}>新增分类 <PlusOutlined /></button>
                    </div>
                    <div style={{ flex: 1 }}>

                    </div>
                    <div style={{ flex: 1 }}>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default CategoryManager;