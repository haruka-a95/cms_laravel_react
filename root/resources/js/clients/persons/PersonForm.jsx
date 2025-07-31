import React, { useEffect, useState } from "react";

function PersonForm({ onSubmit, editingPerson, clients, defaultClientId }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [clientId, setClientId] = useState("");
    const [department, setDepartment] = useState("");
    const [isPrimary, setIsPrimary] = useState(false);

    useEffect(() => {
        if (editingPerson) {
            setName(editingPerson.name);
            setEmail(editingPerson.email);
            setPhone(editingPerson.phone);
            setClientId(editingPerson.client_id);
            setDepartment(editingPerson.department);
            setIsPrimary(editingPerson.is_primary || false);
        } else {
            setName("");
            setEmail("");
            setPhone("");
            setClientId(defaultClientId ?? "");  //初期値を設定
            setDepartment("");
            setIsPrimary(false);
        }
    }, [editingPerson, defaultClientId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            id: editingPerson?.id,
            name,
            email,
            phone,
            client_id: clientId || defaultClientId,
            department,
            is_primary: isPrimary,
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
            >
                <option value="">企業選択</option>
                {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.company_name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="担当者名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="メール"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="電話番号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <input
                type="text"
                placeholder="部署名"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
            />
            <label style={{ marginLeft: "10px" }}>
                <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                />
                窓口に設定
            </label>
            <button type="submit">
                {editingPerson ? "更新" : "追加"}
            </button>
        </form>
    );
}

export default PersonForm;
