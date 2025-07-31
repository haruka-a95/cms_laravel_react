import React, { useEffect, useState } from "react";
import axios from "axios";
import CompanyCategoryForm from "./CompanyCategoryForm";
import CompanyCategoryList from "./CompanyCategoryList";


function CompanyCategory() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(()=> setMessage(null), 3000);
    }

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
    const handleSave = async (category) => {
        try {
            let res;
            if (category.id) {
                //更新
                res = await axios.put(`/api/company_categories/${category.id}`, category);
            } else {
                //登録
                res = await axios.post("/api/company_categories", category);
            }
            showMessage(res.data.message);//Laravelからのメッセージ
            fetchCategories();
            setEditingCategory(null);
        } catch (error) {
            console.error("保存失敗");
        }
    };

    // 削除処理
    const handleDelete = async (id) => {
        if (!window.confirm("このカテゴリを削除しますか？")) return;

        try {
            await axios.delete(`/api/company_categories/${id}`);
            fetchCategories();
        } catch (err) {
            setError("削除に失敗しました", err);
        }
    };

    if (loading) return <p>カテゴリを読み込み中...</p>;

    return (
        <div>
            <div>{message && <div className="message">{message}</div>}</div>
            <div>
            <CompanyCategoryForm onSubmit={handleSave} editingCategory={editingCategory} />
            <CompanyCategoryList
                categories={categories}
                onDelete={handleDelete}
                onEdit={setEditingCategory}
            />
            </div>
        </div>
    );
}

export default CompanyCategory;
