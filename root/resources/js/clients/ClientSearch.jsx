import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import InputField from "../components/forms/InputField";
import CheckboxGroup from "../components/forms/CheckboxGroup";
import Button from "../components/Button";

const STATUS_OPTIONS = [
  { value: "prospect", label: "見込み" },
  { value: "active", label: "取引中" },
  { value: "suspended", label: "停止" },
  { value: "closed", label: "取引終了" },
];

export default function ClientSearch({ onResults }) {
  const [status, setStatus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [personName, setPersonName] = useState("");

  //カテゴリをAPIで取得
  useEffect(() => {
    axios.get("/api/company_categories")
      .then(res => setCategories(res.data.data || res.data))
      .catch(() => alert("カテゴリ取得失敗"));
  }, []);

  //検索
  const handleSearch = async (e) => {
    e.preventDefault();
    // console.log('検索開始');
    const params = {
      status: status.join(','),
      company_category_ids: selectedCategories.join(','),
      company_name: companyName,
      person_name: personName,
    };

    try {
      const res = await axios.get("/api/clients", { params });
      // console.log("検索結果:", res.data);
      onResults(res.data.data ?? []);
      // console.log('完了');
    } catch {
      alert("検索失敗");
    }
  };

  //リセット
  const handleReset = async () => {
    setStatus([]);
    setSelectedCategories([]);
    setCompanyName("");
    setPersonName("");

    try {
        //全件取得
        const res = await axios.get("/api/clients");
        onResults(res.data.data);
    } catch (error) {
        alert("リセット時のデータ取得失敗");
    }
  };

  return (
    <div className="bg-sky-100">
        <h2>検索フォーム</h2>
        <form onSubmit={handleSearch} className="mb-4 border p-4 rounded shadow-sm">
        <CheckboxGroup
            label="ステータス"
            options={STATUS_OPTIONS}
            selected={status}
            onToggle={(v) => setStatus(prev =>
            prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
            )}
        />

        <CheckboxGroup
            label="カテゴリ"
            options={categories.map(c => ({ id: c.id, name: c.name }))}
            selected={selectedCategories}
            onToggle={(id) => setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
            )}
        />

        <InputField
            label="会社名"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
        />

        <InputField
            label="担当者名"
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
        />

        <Button variant="primary" type="submit">検索</Button>
        <Button variant="secondary" type="button" onClick={handleReset}>リセット</Button>
        </form>
    </div>
  );
}