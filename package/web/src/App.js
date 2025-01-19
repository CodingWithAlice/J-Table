import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LtnTable from './components/LtnTable';
import Main from './components/mainApp';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/ltn" element={<LtnTable />} />
            </Routes>
        </Router >
    );
}

export default App;
