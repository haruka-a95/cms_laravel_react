import React, { useState, useEffect } from "react";

export default function ClientPdfDownload(){
    const [jobId, setJobId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [error, setError] = useState(null);

    //ジョブ開始
    const startJob = async () => {
        setError(null);
        setProgress(0);
        setStatus("pending");
        setFileUrl(null);

        try {
            const res = await fetch("api/pdf-job-start", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
            });
            const data = await res.json();
            setJobId(data.job_id);
        } catch (e) {
            setError("ジョブ開始失敗");
            setStatus(null);
        }
    };

    //進捗ボーリング
    useEffect(()=>{
        if (!jobId) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/pdf-job/progress/${jobId}`);
                if(!res.ok) throw new Error("進捗取得失敗");
                const data = await res.json();
                setProgress(data.progress);
                setStatus(data.status);

                if (data.status === "completed") {
                    setFileUrl(data.file_url);
                    clearInterval(interval);
                }
                if (data.status === "failed") {
                    setError("PDF生成失敗");
                    clearInterval(interval);
                }
            } catch {
                setError("進捗取得失敗しました");
                clearInterval(interval);
                }
            }, 2000);

            return ()=> clearInterval(interval);
        }, [jobId]);

        return(
            <div>
                <button onClick={startJob} disabled={status==="pending" || status==="processing"} className="bg-emerald-300 p-2 rounded">
                    クライアント一覧PDF取得
                </button>
                {status && <p>ステータス: {status}  進捗状況: {progress}%</p>}
                {error && <p style={{color: "red"}}>{error}</p>}

                {fileUrl && (
                    <p style={{color:"green"}}>
                        PDF生成完了: {" "}
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" download className="underline bold">ダウンロード</a>
                    </p>
                )}
            </div>
        )

    }