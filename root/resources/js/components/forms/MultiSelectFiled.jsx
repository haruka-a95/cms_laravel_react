import React from "react";

export default function MultiSelectField({ label, name, values, options, onChange }) {
    return (
        <div>
            <label>{label}</label><br />
            <select
                name={name}
                multiple
                value={values}
                onChange={(e) =>
                    onChange(Array.from(e.target.selectedOptions, option => Number(option.value)))
                }
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
