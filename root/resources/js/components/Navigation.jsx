import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="mb-4 p-4 bg-gray-100 border-b">
      <Link to="/clients" className="mr-4 hover:underline">企業一覧</Link>
      <Link to="/company_categories" className="mr-4 hover:underline">企業カテゴリ一覧</Link>
      <Link to="/persons" className="mr-4 hover:underline">担当者</Link>
      <Link to="/clients/import" className="mr-4 hover:underline">CSVから企業登録</Link>
    </nav>
  );
}
