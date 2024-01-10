import React from 'react';


const Dropdown = ({ label, options, onChange }) => {
    return (
        <div>
            <label>
                {label}
                <select onChange={(e) => onChange(e.target.value)}>
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </label>
        </div>
    );
};

export default Dropdown;
