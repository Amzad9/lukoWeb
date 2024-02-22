import React from 'react';

const SelectInput = ({ name, value, onChange, listOption }) => {
  return (
    <select
      className="select select-bordered w-full max-w-xs mb-4"
      name={name}
      value={value}
      onChange={onChange}
    >
      {/* <option disabled value="">Select</option> */}
      {listOption.length > 0 && listOption.map((item) => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))}
    </select>
  );
};

export default SelectInput;
