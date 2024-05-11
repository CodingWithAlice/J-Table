import { Table, Tag, Progress } from 'antd';
import './App.css';

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

function App() {
    // 固定表头
    const columns = [
        {
            key: 'category',
            dataIndex: 'category',
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
        },
        {
            key: 'target',
            dataIndex: 'target',
            title: '目标',
        },
        {
            key: 'quantify',
            dataIndex: 'quantify',
            title: '量化',
        },
        {
            title: '周完成情况',
            children: Array.from(Array(7).keys(), (x) => x + 1).map((weekday) => {
                return {
                    title: `周${weekday}`,
                    key: `${weekday}`,
                    dataIndex: `${weekday}`,
                }
            })
        },
        {
            key: 'rate',
            dataIndex: 'rate',
            title: '完成率',
            width: 56,
            className: 'rateBox',
            render: (_, { rate }) => {
                return <div style={{ 
                    backgroundColor: 'antiquewhite',
                    width: `${rate < 40 ? 40 : rate * 0.6 + 40}%`,
                    height: 56 ,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center' 
                }} className='rate'>{rate}%</div>
            }
        },
        {
            key: 'excuse',
            dataIndex: 'excuse',
            title: '解释一下吧',
        },
    ]
    // 模拟数据
    const data = [
        {
            key: 'target1',
            category: [Category.learning],
            target: 'Brown',
            quantify: 32,
            rate: 40,
            excuse: '描述',
        },
        {
            key: 'target2',
            category: [Category.life],
            target: 'Brown',
            quantify: 32,
            rate: 0,
            excuse: '描述',
        },
        {
            key: 'target3',
            category: [Category.health],
            target: 'Brown',
            quantify: 32,
            rate: 100,
            excuse: '描述',
        },
    ];

    return (
        <div className="App">
            {/* 大标题 */}
            <h1 className='title'>
                J人热爱统计的一生
            </h1>

            {/* 可量化目标 */}
            <Table
                dataSource={data}
                pagination={false}
                columns={columns}
                bordered
                title={() =>
                    // Week 信息
                    <div className='week'>Week 9 复盘</div>
                }
                className='table'
            >
                {/* 分类 + 目标 + 量化 */}
            </Table>
            {/* 不可量化目标 */}

        </div>
    );
}

export default App;
