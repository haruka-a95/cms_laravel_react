import React from "react";

export default function SelectField({ label, name, value, options, onChange, placeholder, br=false }) {
    return (
        <div>
            <label>{label}</label>{br && <br />}
            <select name={name} value={value} onChange={onChange}>
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
