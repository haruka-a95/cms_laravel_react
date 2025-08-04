import React from "react";

export default function InputField( { label, name, value, onChange, placeholder, required = false }){
    return (
        <div>
            <label>{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}