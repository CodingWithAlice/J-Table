import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LtnTable from './components/LtnTable';
import AnswerPage from './pages/AnswerPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LtnTable />} />
                <Route path="/answer/:topicId" element={<AnswerPage />} />
            </Routes>
        </Router >
    );
}

export default App;
