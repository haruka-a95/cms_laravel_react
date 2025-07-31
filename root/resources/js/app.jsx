import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CompanyCategory from './clients/companyCategories';
import Person from './clients/persons/Person';
import Client from './clients/Client';
import ClientDetail from './clients/ClientDetail';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/clients">企業一覧</Link> |{' '}
                <Link to="/company_categories">企業カテゴリ一覧</Link> |{' '}
                <Link to="/persons">担当者</Link> |{' '}
            </nav>
            <Routes>
                <Route path="/clients" element={<Client />} />
                <Route path="/company_categories" element={<CompanyCategory />} />
                <Route path="/persons" element={<Person />} />
                <Route path='/clients/:id' element={<ClientDetail />} />
                <Route path="/" element={<h1>ホーム</h1>} />
            </Routes>
            </BrowserRouter>
    );
}

// React 18 のルート作成
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
