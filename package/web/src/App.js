import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LtnTable from './components/LtnTable';
import TimeLine from './components/timeLine';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/time" element={<TimeLine />} />
                <Route path="/" element={<LtnTable />} />
            </Routes>
        </Router >
    );
}

export default App;
