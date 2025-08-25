import React, { useState } from "react";
import axios from "axios";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function ClientCsvUpload(){
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [previewData, setPreviewData] = useState([]); //csv全行
    const [loading, setLoading] = useState(false);
    const [errorsArr, setErrorsArr] = useState([]);//エラー行メッセージ
    const navigate = useNavigate();
    const [validRecords, setValidRecords] = useState([]); //登録可能行
    const [warnings, setWarnings] = useState([]);

    //CSVアップロード
    const handleFileChange = (e) => {
        setFile(null);
        setPreviewData([]);
        setErrorsArr([]);
        setValidRecords([]);
        setMessage("");
        setError("");

        //新しいファイルをセット
        if (e.target.files.length > 0) {
        setFile(e.target.files[0]);
        }
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
            const validRecords = res.data.valid_records || [];

            setPreviewData(data);

            setErrorsArr(errorsArr);
            setMessage(warnings.length ? "警告: " + warnings.join(", ") : "読み込み成功");
            setError(errorsArr.length ? errorsArr.join(", ") : "");
            setWarnings(warnings);
            setValidRecords(validRecords);

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
                //全件登録成功
                setPreviewData([]);
                setFile(null);
                setLoading(false);
                navigate("/clients");//一覧画面に遷移
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

                {message && (<p className={message.includes("警告") ? "text-red-600" : "text-green-600"}>{message}</p>)}
                {error && <p className="text-red-600">{error}</p>}

                <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />

                <Button onClick={handlePreview} disabled={!file || loading}>
                    プレビュー
                </Button>
                <Button onClick={handleImport} disabled={loading || validRecords.length === 0}>
                    登録
                </Button>
            </div>

            {/* 読み込み中 */}
            {loading && (<p className="mt-4 text-center">読み込み中...</p>)}

            {/* プレビュー表示 */}
            {previewData.length > 0 && (
                <div className="mt-4 overflow-x-auto flex flex-col gap-3">
                    {error && (<p>登録エラーの行は赤くハイライトされています。</p>)}
                    <table className="text-center border-collapse table-auto border border-gray-300">
                        <thead>
                        <tr>
                            {Object.keys(previewData[0]).map((key) =>{
                                // __row_number を「行番号」に置き換え
                                const displayKey = key === "__row_number" ? "行番号" : key;

                                //許可されていないヘッダーを警告表示
                                const errorHeaders = warnings
                                    .map(w => w.replace('未定義のヘッダーが含まれています: ', '').split(','))
                                    .flat();
                                const isErrorHeader = errorHeaders.includes(key);
                                return (
                                    <th key={key}
                                        className={`border border-gray-300 px-4 py-2 ${isErrorHeader ? 'bg-red-100' : ''}`}
                                    >{displayKey}</th>
                                )
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {previewData.map((row, idx) =>{
                            const errorRow = errorsArr.some(err => err.startsWith(`${row.__row_number}行目`));
                            return(
                            <tr key={idx} className={errorRow ? "bg-red-100" : ""}>
                            {Object.values(row).map((val, i) => (
                                <td key={i} className="border border-gray-300 px-4 py-2">{val}</td>
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