import { Space, Table, Tag } from 'antd';
import './App.css';

const { Column, ColumnGroup } = Table;

function App() {
    // 固定表头
    const headers = [
        {
            key: 'category',
            dataIndex: 'category',
            title: '分类'
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
            type: 'group',
            key: 'weekday',
            dataIndex: 'weekday',
            title: '周完成情况',
            dataSource: Array.from(Array(7).keys(), (x) => x + 1).map((weekday) => {
                return {
                    title: `周${weekday}`,
                    key: `${weekday}`,
                    dataIndex: `${weekday}`,
                }
            })
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
            key: '1',
            firstName: 'John',
            lastName: 'Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
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
                title={() =>
                    // Week 信息
                    <div className='week'>Week 9 复盘</div>
                }
                className='table' >
                {/* 分类 + 目标 + 量化 */}
                {headers.map((header) => {
                    if (header?.type !== 'group') {
                        return <Column title={header.title} dataIndex={header.dataIndex} key={header.key} />
                    } else {
                        return <ColumnGroup title={header.title}>
                            {header?.dataSource ? header?.dataSource.map((data) => <Column title={data.title} dataIndex={data.dataIndex} key={data.key} />) : <></>}


                        </ColumnGroup>
                    }
                })}
            </Table>
            {/* 不可量化目标 */}

        </div>
    );
}

export default App;
