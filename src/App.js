
import { Table } from 'antd';
import './App.css';

function App() {
    const dataSource = [
        {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
        {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
    ];

    const columns = [
        {
            title: '分类',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '目标',
            dataIndex: 'target',
            key: 'target',
        },
        {
            title: '量化',
            dataIndex: 'execution',
            key: 'execution',
        },
        {
            title: '每周',
            dataIndex: 'weekday',
            key: 'weekday',
        },
        {
            title: '完成率',
            dataIndex: 'portion',
            key: 'portion',
        },
        {
            title: '解释一下吧',
            dataIndex: 'explain',
            key: 'explain',
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
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                title={() =>
                    // Week 信息
                    <div className='week'>Week 9 复盘</div>
                }
                className='table' />;
            {/* 不可量化目标 */}

        </div>
    );
}

export default App;
