import React from "react";

export default function CheckboxGroup({ label, options, selected, onToggle }) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map(opt => (
          <label key={opt.value || opt.id} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selected.includes(opt.value || opt.id)}
              onChange={() => onToggle(opt.value || opt.id)}
            />
            {opt.label || opt.name}
          </label>
        ))}
      </div>
    </div>
  );
}
