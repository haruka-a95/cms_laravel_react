import React, { useState } from "react";
import axios from "axios";
import Button from "../components/Button";

export default function ClientCsvUpload(){
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [previewData, setPreviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorsArr, setErrorsArr] = useState([]);

    //CSVアップロード
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    //CSVプレビュー
    const handlePreview = async () => {
        if (!file) {
            setError("csvファイルを選択してください");
            return;
        }

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const formData = new FormData();
            formData.append("csv", file);

            const res = await axios.post("/api/clients/import/preview", formData,{
                headers: { "Content-Type": "multipart/form-data"},
            });

            const data = res.data.records || [];
            const warnings = res.data.warnings || [];
            const errorsArr = res.data.errors || [];

            setPreviewData(data);

            setErrorsArr(errorsArr);
            setMessage(warnings.length ? "警告: " + warnings.join(", ") : "読み込み成功");
            setError(errorsArr.length ? errorsArr.join(", ") : "");
            console.log(data);

        } catch (error) {
            setError(error.response?.data?.message || "読み込み失敗");
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    //DB登録
    const handleImport = async () => {
        if (previewData.length === 0 ) return;
        setLoading(true);
        setMessage("");
        try {
           const res = await axios.post("/api/clients/import/register", { data: previewData });
            setMessage(`CSVからデータを登録しました (登録完了: ${res.data.inserted_count}件/ 登録スキップ${res.data.skipped.length}件)`);

            if (res.data.skipped.length > 0) {
                setError("一部の行に未登録のカテゴリがあっため登録をスキップしたデータがあります。");
                setPreviewData(res.data.skipped);
            } else {
                setPreviewData([]);
                setFile(null);
            }
        } catch (error) {
            setMessage("CSVからのデータ登録に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="p-4 bg-white rounded shadow-md w-full max-w-md mx-auto mt-10">
                <h1 className="text-xl font-bold mb-4">クライアント登録：CSVアップロード</h1>

                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}

                <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />

                <Button onClick={handlePreview} disabled={!file || loading}>
                    プレビュー
                </Button>
                <Button onClick={handleImport} disabled={previewData.length === 0 || loading}>
                    登録
                </Button>
            </div>

            {/* 読み込み中 */}
            {loading && (<p>読み込み中...</p>)}

        {/* プレビュー表示 */}
            {previewData.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                    {error && (<p>登録エラーの行は以下の通りです。</p>)}
                    <table>
                        <thead>
                        <tr>
                            {Object.keys(previewData[0]).map((key) => (
                            <th key={key}>{key}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {previewData.map((row, idx) =>{
                            const errorRow = errorsArr.includes(`${idx +2}行目: 会社名が空`);
                            return(
                            <tr key={idx} className={errorRow ? "bg-red-100" : ""}>
                            {Object.values(row).map((val, i) => (
                                <td key={i}>{val}</td>
                            ))}
                            </tr>
                        );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}