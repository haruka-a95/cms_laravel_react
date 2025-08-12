import React from "react";

export default function CategoryDetailModal({ category, onClose }){
    if(!category) return null;

    return(
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-2/3 max-w-lg relative">
                <button className="close text-right" onClick={onClose}>✕</button>

                <h2 className="text-xl font-bold mb-4">カテゴリ詳細</h2>
                <p><strong>カテゴリ名：</strong>{category.name}</p>
                <p><strong>作成日:</strong> {category.created_at}</p>
                <p><strong>更新日:</strong> {category.updated_at}</p>
            </div>
        </div>
    );
}