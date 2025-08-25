import React from "react";
import { Link } from "react-router-dom";
import ClientPdfDownload from "./ClientPdfDownload";
import Button from "../components/Button";

function ClientList({ clients, onEdit, onDelete }) {

    return (
        <div>
            <h2 className="bold text-center text-2xl">クライアント一覧</h2>
            <p className="text-center">社名をクリックして詳細を表示</p>
            <ClientPdfDownload />
            <table border="1" className="mx-auto">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>業種</th>
                        <th>会社名</th>
                        <th>担当者名</th>
                        <th>電話番号</th>
                        <th>メール</th>
                        <th>住所</th>
                        <th>操作</th>
                        <th>ステータス</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(clients) && clients.length > 0 ? (
                        clients.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>
                                    {c.categories && c.categories.length > 0
                                    ? c.categories.map(cat => cat.name).join(', ')
                                    : '-'}
                                </td>
                                <td><Link to={`/clients/${c.id}`}>{c.company_name}</Link></td>
                                <td>{c.persons && c.persons.length > 0
                                    ? (c.persons.find(person => person.is_primary) || {name: '-'}).name : '-'}</td>
                                <td>{c.phone}</td>
                                <td>{c.email}</td>
                                <td>{c.address}</td>
                                <td>
                                    <Button variant="primary" type="button" onClick={() => onEdit(c)}>編集</Button>
                                    <Button variant="danger" type="button" onClick={() => onDelete(c.id)}>削除</Button>
                                </td>
                                <td>{c.status_label}</td>
                            </tr>
                        ))
                    ) : (<tr><td colSpan="9">データがありません。</td></tr>)}
                </tbody>
            </table>
        </div>
    );
}

export default ClientList;
