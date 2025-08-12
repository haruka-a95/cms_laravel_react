import React, { useEffect, useState } from "react";
import axios from "axios";
import PersonForm from "./PersonForm";
import PersonList from "./PersonList";

function Person() {
    const [persons, setPersons] = useState([]);
    const [clients, setClients] = useState([]);
    const [editingPerson, setEditingPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    // 初期ロード
    useEffect(() => {
        fetchPersons();
        fetchClients();
    }, []);

    // 担当者一覧取得
    const fetchPersons = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/persons");
            setPersons(res.data.data);
        } catch (err) {
            setError("担当者の取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    // クライアント一覧取得（プルダウン用）
    const fetchClients = async () => {
        try {
            const res = await axios.get("/api/clients");
            setClients(res.data.data);
        } catch (err) {
            console.error("クライアント一覧取得エラー", err);
        }
    };

    // 保存処理
    const handleSave = async (person) => {
        try {
            let res;
            if (person.id) {
                res = await axios.put(`/api/persons/${person.id}`, person);
            } else {
                res = await axios.post("/api/persons", person);
            }
            setMessage(res.data.message);
            fetchPersons();
            setEditingPerson(null);
        } catch (err) {
            setError("保存に失敗しました");
        }
    };

    // 削除処理
    const handleDelete = async (id) => {
        if (!window.confirm("この担当者を削除しますか？")) return;
        try {
            const res = await axios.delete(`/api/persons/${id}`);
            setMessage(res.data.message);
            fetchPersons();
        } catch (err) {
            setError("削除に失敗しました");
        }
    };

    if (loading) return <p>読み込み中...</p>;

    return (
        <div>
            <h2>担当者管理</h2>
            {message && <div style={{ color: "green" }}>{message}</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}

            <PersonForm
                onSubmit={handleSave}
                editingPerson={editingPerson}
                clients={clients}
            />

            <PersonList
                persons={persons}
                onEdit={setEditingPerson}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default Person;
