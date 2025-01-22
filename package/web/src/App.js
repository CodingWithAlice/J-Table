import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LtnTable from './components/LtnTable';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LtnTable />} />
            </Routes>
        </Router >
    );
}

export default App;
