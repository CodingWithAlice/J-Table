import { Table } from 'antd';
import './App.css';

function App() {
    // 固定表头
    const columns = [
        {
            key: 'category',
            dataIndex: 'category',
            title: '分类',
            width: 80,
            // fixed: 'left',
        },
        {
            key: 'target',
            dataIndex: 'target',
            title: '目标'
        },
        {
            key: 'quantify',
            dataIndex: 'quantify',
            title: '量化'
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
            title: '完成率'
        },
        {
            key: 'excuse',
            dataIndex: 'excuse',
            title: '解释一下吧'
        },
    ]
    // 模拟数据
    const data = [
        {
            key: 'learning',
            category: 'John',
            target: 'Brown',
            quantify: 32,
            rate: 'New York No. 1 Lake Park',
            excuse: '1',
        },
        {
            key: '2',
            firstName: 'Jim',
            lastName: 'Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            firstName: 'Joe',
            lastName: 'Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
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
