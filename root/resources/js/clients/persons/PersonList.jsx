import React from "react";

function PersonList({ persons, onEdit, onDelete }){
    return (
        <div>
            <h2>担当者一覧</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>企業名</th>
                        <th>部署</th>
                        <th>名前</th>
                        <th>TEL</th>
                        <th>メールアドレス</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {persons.map((p) => (
                        <tr key={p.id}>
                            {/* client がある場合だけ企業名を表示 */}
                            <td>{p.id}</td>
                            <td>{p.client ? p.client.company_name : "-"}</td>
                            <td>{p.department ?? "-"}</td>
                            <td>{p.name}</td>
                            <td>{p.email}</td>
                            <td>{p.phone}</td>
                            <td>
                                <button onClick={() => onEdit(p)}>編集</button>
                                <button onClick={() => onDelete(p)}>削除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PersonList;