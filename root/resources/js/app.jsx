import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CompanyCategory from './clients/companyCategories';
import Person from './clients/persons/Person';
import Client from './clients/Client';
import ClientDetail from './clients/ClientDetail';
import Navigation from './components/Navigation';
import ClientCsvUpload from './clients/ClientCsvUpload';


function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/clients" element={<Client />} />
                <Route path="/company_categories" element={<CompanyCategory />} />
                <Route path="/persons" element={<Person />} />
                <Route path='/clients/:id' element={<ClientDetail />} />
                <Route path="/" element={<h1>ホーム</h1>} />
                <Route path='/clients/import' element={<ClientCsvUpload />} />
            </Routes>
            </BrowserRouter>
    );
}

// React 18 のルート作成
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
