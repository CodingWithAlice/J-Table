import {
    EditableProTable,
    ProCard,
    ProFormField,
    ProFormRadio,
} from '@ant-design/pro-components';
import { Tag } from 'antd';
import React, { useState } from 'react';
import { Category, CategoryColor } from './utils/utils';
import { getWeek } from './utils/getWeeks';
import './App.css';

const waitTime = (time = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};


const defaultData = [
    {
        key: 'target0',
        category: [Category.learning],
        target: '背单词100个',
        quantify: 7,
        state: 'open',
        // excuse: '描述',
        weekSituation: [1, 0, 1, 1, 0, 1, 1],
    },
    {
        key: 'target1',
        category: [Category.life],
        target: '运动1h',
        quantify: 5,
        // excuse: '描述',
        weekSituation: [0, 0, 1, 1, 0, 0, 1],
        state: 'open',
    },
    {
        key: 'target2',
        category: [Category.health],
        target: '阅读30m',
        quantify: 5,
        // excuse: '描述',
        weekSituation: [0, 1, 1, 1, 1, 1, 1],
        state: 'open'
    },
];

export default function EditTable() {
    const [editableKeys, setEditableRowKeys] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [position, setPosition] = useState(
        'bottom',
    );

    // 固定表头
    const columns = [
        {
            title: '分类',
            dataIndex: 'category',
            tooltip: '将事项拆分成学习、生活、健康三大类',
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules:
                        rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
                };
            },
            // 第一行不允许编辑
            editable: (text, record, index) => {
                return index !== 0;
            },
            width: '9%',
            render: (category) => (
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
        },
        {
            title: '目标',
            dataIndex: 'target',
            tooltip: '自定义具体目标',
            readonly: true,
            width: '15%',
        },
        {
            title: '量化',
            key: 'quantify',
            dataIndex: 'quantify',
            render: (_, { quantify }) => {
                return <>{quantify}次/周</>
            },
        },
        // {
        //     title: '状态',
        //     key: 'state',
        //     dataIndex: 'state',
        //     valueType: 'select',
        //     valueEnum: {
        //       all: { text: '全部', status: 'Default' },
        //       open: {
        //         text: '未解决',
        //         status: 'Error',
        //       },
        //       closed: {
        //         text: '已解决',
        //         status: 'Success',
        //       },
        //     },
        //   },
        // {
        //     title: '描述',
        //     dataIndex: 'decs',
        //     fieldProps: (form, { rowKey, rowIndex }) => {
        //         if (form.getFieldValue([rowKey || '', 'title']) === '不好玩') {
        //             return {
        //                 disabled: true,
        //             };
        //         }
        //         if (rowIndex > 9) {
        //             return {
        //                 disabled: true,
        //             };
        //         }
        //         return {};
        //     },
        // },
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
            }),
        },
        {
            key: 'rate',
            dataIndex: 'rate',
            title: '完成率',
            width: '6%',
            className: 'rateBox',
            render: (_, { weekSituation = [], quantify }) => {
                const rate = (weekSituation?.filter(i => i)?.length) / (+quantify || 7) * 100;
                const show = rate.toFixed(0);
                return <div style={{
                    backgroundColor: 'antiquewhite',
                    width: `${rate < 40 ? 40 : rate > 100 ? 100 : rate * 0.6 + 40}%`,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} className='rate'>{show >= 100 ? 100 : show}%</div>
            },
            editable: false, // 由前面数据计算而得
        },
        {
            title: '操作',
            valueType: 'option',
            width: 100,
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setDataSource(dataSource.filter((item) => item.id !== record.id));
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (
        <>
            <EditableProTable
                rowKey="id"
                headerTitle={<div className='week'>Week {getWeek()} 复盘</div>}
                maxLength={5}
                scroll={{
                    x: 960,
                }}
                recordCreatorProps={
                    position !== 'hidden'
                        ? {
                            position: position,
                            record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                        }
                        : false
                }
                loading={false}
                toolBarRender={() => [
                    <ProFormRadio.Group
                        key="render"
                        fieldProps={{
                            value: position,
                            onChange: (e) => setPosition(e.target.value),
                        }}
                        // options={[
                        //     {
                        //         label: '添加到顶部',
                        //         value: 'top',
                        //     },
                        //     {
                        //         label: '添加到底部',
                        //         value: 'bottom',
                        //     },
                        //     {
                        //         label: '隐藏',
                        //         value: 'hidden',
                        //     },
                        // ]}
                    />,
                ]}
                columns={columns}
                request={async () => ({
                    data: defaultData,
                    total: 3,
                    success: true,
                })}
                value={dataSource}
                onChange={setDataSource}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        console.log(rowKey, data, row);
                        await waitTime(2000);
                    },
                    onChange: setEditableRowKeys,
                }}
            />
        </>
    );
};