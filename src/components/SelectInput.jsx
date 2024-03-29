import React from 'react';

const SelectInput = ({ name, value, onChange, listOption, inputError }) => {
  return (
    <>
    <select
      className="select select-bordered w-full max-w-xs mb-4"
      name={name}
      value={value}
      onChange={onChange}
    >
      <option disabled value="">Select</option>
      {listOption  && listOption.map((item) => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))}
    </select>
     {inputError && <p className="text-error">{inputError}</p>}
     </>
  );
};

export default SelectInput;
