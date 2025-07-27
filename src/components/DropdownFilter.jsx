const DropdownFilter = ({ label, options, value, onChange }) => (
  <div className="flex items-center gap-2">
    <label className="font-medium">{label}:</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-2 py-1"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt === "All" ? "All Profiles" : `Profile ${opt}`}
        </option>
      ))}
    </select>
  </div>
);
export default DropdownFilter;