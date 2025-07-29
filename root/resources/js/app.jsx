import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CompanyCategory from './CompanyCategory';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/company_categories">企業カテゴリ一覧</Link> |{' '}
                {/* <Link to="/clients">Clients</Link> */}
            </nav>
            <Routes>
                <Route path="/company_categories" element={<CompanyCategory />} />
                {/* <Route path="/clients" element={<ClientList />} /> */}
                <Route path="/" element={<h1>ホーム</h1>} />
            </Routes>
            </BrowserRouter>
    );
}

// React 18 のルート作成
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
