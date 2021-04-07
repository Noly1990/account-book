import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Flex from "../Layout/Flex";
import Space from "../Layout/Space";
import Modal from "./Modal";

function CategoryManager(props: {
    cateMap: Map<string, any>,
    handleCateMap: (category: Map<string, any>) => void
}) {

    const { cateMap, handleCateMap } = props

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
            while (true) {
                randomId = Math.random().toString(32).slice(2);
                if (!cateMap.has(randomId)) break
            }
            cateMap.set(randomId, {
                id: randomId,
                name: newCate.name,
                type: newCate.type
            })
        } else {
            cateMap.set(newCate.id, {
                id: newCate.id,
                name: newCate.name,
                type: newCate.type
            })
        }
        handleCateMap(cateMap)
        setVisible(false)
    }


    function deleteCate(id: string) {
        cateMap.delete(id)
        handleCateMap(cateMap)
    }

    return (
        <div style={{ marginTop: 20 }}>
            <Modal title={newCate.ope === 'add' ? "新增分类" : "修改分类"} width={400} visible={visible}>
                <Flex style={{ marginTop: 20 }}>
                    <Flex.Item >
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
                    </Flex.Item>
                </Flex>
                <div style={{ marginTop: 20 }}>
                    <label htmlFor="category">分类名称：</label>
                    <input onChange={(e) => {
                        setNewCate({
                            ...newCate,
                            name: e.target.value
                        })
                    }} name="category" type="text" minLength={1} maxLength={10} value={newCate.name} />
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, margin: 6 }}>
                    <Space>
                        <button onClick={() => {
                            setVisible(false)
                        }}>取消</button>
                        <button onClick={addNewCate}>确认</button>
                    </Space>
                </div>
            </Modal>
            <Flex key='title'>
                <Flex.Item>
                    序号
                </Flex.Item>
                <Flex.Item>
                    收支类型
                </Flex.Item>
                <Flex.Item>
                    分类名称
                </Flex.Item>
                <Flex.Item>
                    操作
                </Flex.Item>
            </Flex>
            {
                Array.from(props.cateMap).map((v, i) =>
                    <Flex style={{ marginTop: 8 }} key={v[0]}>
                        <Flex.Item>
                            {i + 1}
                        </Flex.Item>
                        <Flex.Item>
                            {v[1].type === 0 ? '支出' : '收入'}
                        </Flex.Item>
                        <Flex.Item>
                            {v[1].name}
                        </Flex.Item>
                        <Flex.Item>
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
                        </Flex.Item>
                    </Flex>)
            }

            <Flex style={{ display: 'flex', marginTop: 15 }} key='addBtn'>
                <Flex.Item></Flex.Item>
                <Flex.Item>
                    <button onClick={() => {
                        setVisible(true)
                    }}>新增分类 <PlusOutlined /></button>
                </Flex.Item>
                <Flex.Item></Flex.Item>
            </Flex>
        </div>
    )
}

export default CategoryManager;