import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import PersonForm from "./persons/PersonForm";

function ClientDetail(){
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPerson, setEditingPerson] = useState(null);

    //クライアント情報取得
    const fetchClient = async () => {
        try {
            const res = await axios.get(`/api/clients/${id}`);
            setClient(res.data);
        } catch (error) {
            setError("クライアント情報の取得に失敗");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClient();
    }, [id]);

    //担当者追加、更新
    const handlePersonSave = async (person) => {
        try {
            if (person.id) {
                await axios.put(`/api/persons/${person.id}`, person);
            } else {
                await axios.post(`/api/persons`, person);
            }
            setEditingPerson(null);
            fetchClient();
        } catch (error) {
            console.error("担当者取得失敗", error);
        }
    }

    //担当者削除
    const handlePersonDelete = async (id) => {
        if (!window.confirm("この担当者を削除しますか")) return;
        try {
            await axios.delete(`/api/persons/${id}`);
            fetchClient();
        } catch (error) {
            console.error("担当者の削除失敗", error);
        }
    };

    if (loading) return <p>読み込み中...</p>
    if (error) return <p>{error}</p>
    if(!client) return <p>データが見つかりません</p>;


    return (
        <div>
            <h2>クライアント詳細</h2>
            <p><strong>会社名:</strong> {client.company_name}</p>
            <p><strong>電話番号:</strong> {client.phone}</p>
            <p><strong>メール:</strong> {client.email}</p>
            <p><strong>住所:</strong> {client.address}</p>

            <h3>業種カテゴリ</h3>
            <ul>
                {client.categories && client.categories.length > 0 ? (
                    client.categories.map(cat => <li key={cat.id}>{cat.name}</li>)
                ) : (
                    <li>-</li>
                )}
            </ul>
            <h3>担当者一覧</h3>
            <ul>
                {client.persons && client.persons.length > 0 ? (
                    client.persons.map(person => (
                        <li key={person.id}>
                            {person.name}（{person.email ? person.email : "-"}）
                            {person.is_primary && (
                                <span style={{
                                    backgroundColor: "#d8ffe1ff",
                                    padding: "2px 6px",
                                    marginLeft: "8px",
                                    borderRadius: "4px",
                                    fontSize: "0.9em"
                                }}>
                                    窓口担当
                                </span>
                            )}
                            <button onClick={() => setEditingPerson(person)}>編集</button>
                            <button onClick={() => handlePersonDelete(person.id)}>削除</button>
                        </li>
                    ))
                ) : (
                    <li>-</li>
                )}
            </ul>
            <h3>{editingPerson ? "担当者を編集" : "新規担当者を追加"}</h3>
            <PersonForm
                onSubmit={handlePersonSave}
                editingPerson={editingPerson}
                clients={[client]}
                defaultClientId={client.id}
            />

            <Link to="/clients">← クライアント一覧に戻る</Link>
        </div>
    );
}
export default ClientDetail;