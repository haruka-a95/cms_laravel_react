import React, { useEffect, useState } from "react";
import axios from "axios";
import ClientForm from "./ClientForm";
import ClientList from "./ClientList";
import ClientSearch from "./ClientSearch";

function Client() {
    const [clients, setClients] = useState([]);
    const [editingClient, setEditingClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchClients();
    }, []);

    //全件取得
    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/clients");
            setClients(res.data.data);
        } catch (err) {
            setError("クライアント情報の取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };
    //検索
    const handleSearchResults = (results) => {
        //配列かどうか確認
        if (Array.isArray(results)) {
            setClients(results);
        } else if (results?.data && Array.isArray(results.data)) {
            setClients(results.data);
        } else {
            setClients([]);
        }
        // console.log('client.jsx結果：', results);
    }

    const handleSave = async (client) => {
        try {
            let res;
            if (client.id) {
                res = await axios.put(`/api/clients/${client.id}`, client);
            } else {
                res = await axios.post("/api/clients", client);
            }
            setMessage(res.data.message ?? "保存しました");
            fetchClients();
            setEditingClient(null);
        } catch (err) {
            setError("保存に失敗しました");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("このクライアントを削除しますか？")) return;
        try {
            await axios.delete(`/api/clients/${id}`);
            setMessage("削除しました");
            fetchClients();
        } catch (err) {
            setError("削除に失敗しました");
        }
    };

    if (loading) return <p>読み込み中...</p>;

    return (
        <div>
            <h1>クライアント管理</h1>
            {message && <div style={{ color: "green" }}>{message}</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            {/* 追加フォーム */}
            <ClientForm
                onSubmit={handleSave}
                editingClient={editingClient}
            />
            {/* 検索フォーム */}
            <ClientSearch onResults={handleSearchResults}/>
            {/* 一覧 */}
            <ClientList
                clients={clients}
                onEdit={setEditingClient}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default Client;
