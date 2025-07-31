import React, { useEffect, useState } from "react";
import axios from "axios";

function ClientForm({ onSubmit, editingClient }) {
    const [form, setForm] = useState({
        company_name: "",
        phone: "",
        email: "",
        address: "",
        contact_person_id: "",
        company_category_ids:[],
    });

    const [persons, setPersons] = useState([]);
    const [categories, setCategories] = useState([]);

    //フォーム初期化
    useEffect(() => {
        if (editingClient) {
            setForm({
                ...editingClient,
                company_category_ids: editingClient.company_category_ids?.map(c => c.id) || [],
            });
        } else {
            setForm({
                company_name: "",
                phone: "",
                email: "",
                address: "",
                contact_person_id: "",
                company_category_ids: [],
            });
        }
    }, [editingClient]);

    //担当者・カテゴリのリスト取得
    useEffect(()=>{
        axios.get("/api/persons")
        .then(res=>setPersons(res.data.data || res.data))
        .catch(err => console.error("担当者取得失敗"));

        axios.get("/api/company_categories")
        .then(res=> setCategories(res.data.data || res.data))
        .catch(err=>console.error("カテゴリ取得失敗"));
    },[]);

    //入力変更
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    //保存
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{editingClient ? "クライアント編集" : "新規クライアント追加"}</h2>
            {/* 企業カテゴリ選択 */}
            <select name="company_category_ids" multiple value={form.company_category_ids || []}
                onChange={(e)=> setForm({
                ...form,
                company_category_ids: Array.from(e.target.selectedOptions, option => Number(option.value))
            })}>
                <option disabled>企業カテゴリを選択</option>
                {categories.map( c =>(
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="会社名"
                required
            />
            {/* 担当者選択 */}
            <select name="contact_person_id" value={form.contact_person_id} onChange={handleChange}>
                <option value="">担当者を選択</option>
                {persons.map(p=>(
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
            <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="代表電話番号"
            />
            <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="メールアドレス"
            />
            <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="住所"
            />
            <button type="submit">{editingClient ? "更新" : "追加"}</button>
        </form>
    );
}

export default ClientForm;
