import React from "react";

function CompanyCategoryList({ categories, onDelete, onEdit }){
    return (
        <div>
            <h2>企業カテゴリ一覧</h2>
            <ul>
                {categories.map((category)=> (
                    <li key={category.id}>{category.name}
                    <button onClick={()=> onEdit(category)}>編集</button>
                    <button onClick={()=> onDelete(category)}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default CompanyCategoryList;