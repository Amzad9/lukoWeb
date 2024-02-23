import React from 'react';

const TextInput = ({ type, name, value, placeholder, onChange, required, className , handleBlur, handleFocus, inputError}) => {
  return (
   <>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      className={type=="file"? "file-input file-input-bordered file-input-error w-full max-w-xs mb-4": "input input-bordered w-full mb-4"}
      required={required}
      onChange={onChange}
      onBlur={(e) => handleBlur(name)}
      onFocus={() => handleFocus(name)}
    />
     {inputError && <p className="text-error">{inputError}</p>}
   </>
  );
};

export default TextInput;
