import React, { useEffect, useState } from "react";
import axios from "axios";

function CompanyCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);

    // 一覧取得
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get("/api/company_categories");
            setCategories(res.data.data);
        } catch (err) {
            setError("カテゴリの取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    // 登録または更新
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (editingId) {
                // 更新処理
                await axios.put(`/api/company_categories/${editingId}`, { name });
            } else {
                // 新規追加
                await axios.post("/api/company_categories", { name });
            }
            setName("");
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            setError("保存に失敗しました");
        }
    };

    // 編集ボタン押下時
    const handleEdit = (category) => {
        setEditingId(category.id);
        setName(category.name);
    };

    // 削除処理
    const handleDelete = async (id) => {
        if (!window.confirm("このカテゴリを削除しますか？")) return;

        try {
            await axios.delete(`/api/company_categories/${id}`);
            fetchCategories();
        } catch (err) {
            setError("削除に失敗しました");
        }
    };

    if (loading) return <p>カテゴリを読み込み中...</p>;

    return (
        <div>
            <h2>企業カテゴリ {editingId ? "編集" : "追加"}</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    placeholder="カテゴリ名"
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">{editingId ? "更新" : "追加"}</button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setName("");
                        }}
                    >
                        キャンセル
                    </button>
                )}
            </form>

            <h2>企業カテゴリ一覧</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        {category.name}
                        {" "}
                        <button onClick={() => handleEdit(category)}>編集</button>
                        <button onClick={() => handleDelete(category.id)}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CompanyCategory;
