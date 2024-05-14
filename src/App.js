import { Button, Table, Tag, Typography, Form, Popconfirm, InputNumber, Input, Select, Switch } from 'antd';
import './App.css';
import { useState } from 'react';
import { getWeek } from './utils/getWeeks';

// 分类共三类：Learning、Life、Health
const Category = {
    learning: 'Learning',
    life: 'Life',
    health: 'Health',
}
const CategoryColor = {
    Learning: 'green',
    Life: 'pink',
    Health: 'volcano'
}
// 编辑态 - 和 dataIndex 对应的输入框
const EditInput = {
    category: <Select
        defaultValue={Category.learning}
        // style={{
        //     width: 120,
        // }}
        // onChange={handleChange}
        options={[
            {
                value: 'learning',
                label: [Category.learning],
            },
            {
                value: 'life',
                label: [Category.life],
            },
            {
                value: 'health',
                label: [Category.health],
            },
        ]}
    />,
    target: <Input />,
    quantify: <Input />,
    excuse: <Input />,
    weekSituation: <Switch />,
};

const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = EditInput?.[dataIndex] || <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
// 模拟数据
const originData = [
    {
        key: 'target1',
        category: [Category.learning],
        target: 'Brown',
        quantify: 32,
        rate: 40,
        excuse: '描述',
        weekSituation: [1, 0, 1, 1, 0, 1, 1]
    },
    {
        key: 'target2',
        category: [Category.life],
        target: 'Brown',
        quantify: 32,
        rate: 0,
        excuse: '描述',
        weekSituation: [1, 0, 1, 1, 1, 0, 1]
    },
    {
        key: 'target3',
        category: [Category.health],
        target: 'Brown',
        quantify: 32,
        rate: 100,
        excuse: '描述',
        weekSituation: [0, 1, 1, 1, 1, 1, 1]
    },
];

function App() {
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    // 添加目标
    const handleAdd = () => {
        const newData = {
            key: `target${data?.length}`,
            category: [Category.learning],
            target: 'Brown',
            quantify: 32,
            rate: 40,
            excuse: '描述',
            weekSituation: Array(7)
        };
        setData([...data, newData]);
        // setCount(count + 1);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // 固定表头
    const columns = [
        {
            key: 'category',
            dataIndex: 'category',
            width: '6%',
            title: '分类',
            render: (_, { category }) => (
                <>
                    {category?.map((c) => {
                        let color = CategoryColor[c]
                        return (
                            <Tag color={color} key={c}>
                                {c.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
            editable: true,
        },
        {
            key: 'target',
            dataIndex: 'target',
            // width: 56,
            title: '目标',
            editable: true,
        },
        {
            key: 'quantify',
            dataIndex: 'quantify',
            width: '8%',
            // width: 56,
            title: '量化',
            editable: true,
        },
        {
            title: '周完成情况',
            children: Array.from(Array(7).keys(), (x) => x + 1).map((weekday) => {
                return {
                    title: `周${weekday}`,
                    key: `${weekday}`,
                    dataIndex: `${weekday}`,
                    render: (_, { weekSituation }) => {
                        return weekSituation?.[weekday - 1]
                            ? <i className='iconfont icon-duigou' style={{ color: 'pink' }}></i>
                            : <i className='iconfont icon-weiwancheng-copy' style={{ color: 'grey' }}></i>
                    },
                    editable: true,
                }
            })
        },
        {
            key: 'rate',
            dataIndex: 'rate',
            title: '完成率',
            width: '6%',
            className: 'rateBox',
            render: (_, { rate }) => {
                return <div style={{
                    backgroundColor: 'antiquewhite',
                    width: `${rate < 40 ? 40 : rate * 0.6 + 40}%`,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} className='rate'>{rate}%</div>
            },
            editable: false, // 由前面数据计算而得
        },
        {
            key: 'excuse',
            dataIndex: 'excuse',
            title: '解释一下',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: '8%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a href='#'>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className="App">
            {/* 大标题 */}
            <h1 className='title'>
                J人热爱统计的一生
            </h1>

            {/* 可量化目标 */}
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                dataSource={data}
                pagination={false}
                columns={mergedColumns}
                bordered
                rowClassName="editable-row"
                title={() =>
                    // Week 信息
                    <div className='week'>Week {getWeek()} 复盘</div>
                }
                footer={() => <Button onClick={handleAdd} type="primary">
                    Add a Target
                </Button>}
                className='table'
            >
                {/* 分类 + 目标 + 量化 */}
            </Table>
            {/* 不可量化目标 */}

        </div>
    );
}

export default App;
