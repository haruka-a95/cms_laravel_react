import React, { useEffect, useState } from "react";
import axios from "axios";
import SelectField from "../components/forms/SelectFiled";
import MultiSelectField from "../components/forms/MultiSelectFiled";
import InputField from "../components/forms/InputField";
import Button from "../components/Button";

const STATUS_OPTIONS = [
    { value: 'prospect', label: '見込み' },
    { value: 'active', label: '取引中'},
    { value: 'suspended', label: '停止'},
    { value: 'closed', label: '取引終了'},
];

export default function  ClientForm({ onSubmit, editingClient, showToggleButton = false }) {
    const [form, setForm] = useState({
        company_name: "",
        phone: "",
        email: "",
        address: "",
        contact_person_id: "",
        company_category_ids:[],
        status:"prospect",//初期ステータスは見込み
    });

    const [persons, setPersons] = useState([]);
    const [categories, setCategories] = useState([]);
    const [zipcode, setZipcode] = useState("");
    const [showForm, setShowForm] = useState(false);

    //フォーム初期化
    useEffect(() => {
        if (editingClient) {
            setForm({
                ...editingClient,
                company_category_ids: editingClient.categories ? editingClient.categories.map(c => c.id) : [],
                status: editingClient.status ?? "prospect",
            });
        } else {
            setForm({
                company_name: "",
                phone: "",
                email: "",
                address: "",
                contact_person_id: "",
                company_category_ids: [],
                status: "prospect",
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

    // 郵便番号検索
    const handleZipSearch = async () => {
        if (!zipcode) return;
        try {
            const res = await axios.get("https://zipcloud.ibsnet.co.jp/api/search", {params: {zipcode}});

            if (res.data.results) {
                const data = res.data.results[0];
                setForm({
                    ...form,
                    address: `${data.address1}${data.address2}${data.address3}`
                });
            } else {
                alert("住所が見つかりません。");
            }
        } catch (error) {
            console.error("郵便番号検索エラー");
        }
    };

    //保存
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="text-center">
            {/* 表示・非表示ボタン */}
            {showToggleButton && (
                <div className="text-right">
                    <Button variant="primary" type="button" onClick={() => setShowForm((prev) => !prev)}>
                        {showForm ? "－" : "＋"}
                    </Button>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-sky-50 p-3 my-2 max-w-3xl mx-auto rounded shadow">
                    <h2 className="text-center text-lg underline">{editingClient ? "クライアント編集" : "新規クライアント追加"}</h2>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {/* ステータス選択 */}
                        <SelectField
                            label="ステータス"
                            name="status"
                            value={form.status}
                            options={STATUS_OPTIONS}
                            onChange={handleChange}
                        />
                        {/* 企業カテゴリ選択 */}
                        <MultiSelectField
                            label="企業カテゴリ"
                            name="company_category_ids"
                            values={form.company_category_ids}
                            options={categories.map(c => ({ value: c.id, label: c.name }))}
                            onChange={(values) => setForm({ ...form, company_category_ids: values })}
                        />
                        {/* 企業名 */}
                        <InputField
                            label="企業名"
                            name="company_name"
                            value={form.company_name}
                            onChange={handleChange}
                            placeholder="企業名を入力"
                            required
                        />
                        {/* 担当者選択 */}
                        <SelectField
                            label="担当者"
                            name="contact_person_id"
                            value={form.contact_person_id}
                            options={persons.map(p => ({ value: p.id, label: p.name }))}
                            onChange={handleChange}
                            placeholder="担当者を選択"
                        />
                        {/* TEL */}
                        <InputField
                            label="電話番号"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="代表電話番号"
                        />
                        {/* メアド */}
                        <InputField
                                        label="メールアドレス"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="メールアドレス"
                        />
                        {/* 住所 */}
                        {/* 郵便番号 */}
                        <div className="flex gap-2 col-span-2 w-full max-w-xl mx-auto">
                            <InputField label="郵便番号"
                                    name="zipcode"
                                    value={zipcode}
                                    onChange={(e) => setZipcode(e.target.value)}
                                    placeholder="例: 1000001"
                                    className="flex-1" />
                            <Button variant="secondary" type="button" onClick={handleZipSearch}>住所検索</Button>
                            <InputField
                                label="住所"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="住所"
                                className="flex-2"
                            />
                        </div>
                    </div>
                    <Button variant="primary" type="submit">{editingClient ? "更新" : "追加"}</Button>
                </form>
            )}
        </div>
    );
}
