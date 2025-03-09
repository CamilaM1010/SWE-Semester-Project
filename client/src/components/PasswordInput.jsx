import React, { useState } from 'react';

const PasswordInput = ({ id, label, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
        />
        <span 
          className="password-toggle" 
          onClick={togglePasswordVisibility}
        >
          {showPassword ? 'Hide' : 'Show'}
        </span>
      </div>
    </div>
  );
};

export default PasswordInput;