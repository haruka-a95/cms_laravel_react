import React from "react";
import CategoryDetailModal from "./CompanyCategoryDetailModal";
import { useState } from "react";
import Button from "../../components/Button";

function CompanyCategoryList({ categories, onDelete, onEdit }){
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <div>
            <h2>企業カテゴリ一覧</h2>
            <ul>
                {categories.map((category)=> (
                    <li key={category.id}>
                        {category.name}
                    <Button variant="primary" type="button" onClick={() => setSelectedCategory(category)}>詳細</Button>
                    <Button variant="outline" type="button" onClick={()=> onEdit(category)}>編集</Button>
                    <Button variant="danger" type="button" onClick={()=> onDelete(category)}>削除</Button>
                    </li>
                ))}
            </ul>
            {selectedCategory && (
                <CategoryDetailModal
                    category={selectedCategory}
                    onClose={()=> setSelectedCategory(null)}
                />
            )}
        </div>
    );
}
export default CompanyCategoryList;