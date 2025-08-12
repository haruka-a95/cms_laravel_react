import React from "react";
import { useState, useEffect } from "react";

function CompanyCategoryForm({ onSubmit, editingCategory }){
    const [name, setName] = useState('');

    useEffect(()=>{
        if (editingCategory) {
            setName(editingCategory.name);
        }
    }, [editingCategory]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({id: editingCategory?.id, name });
    };

    return (
        <div>
            <h2>{editingCategory ? "カテゴリ編集" : "カテゴリ追加"}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} placeholder="カテゴリ名" onChange={(e)=>setName(e.target.value)}/>
                <button type="submit">{editingCategory ? "更新" : "追加"}</button>
            </form>
        </div>
    )
}

export default CompanyCategoryForm;