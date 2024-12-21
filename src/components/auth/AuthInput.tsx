import React from 'react';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  required
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-1">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      required={required}
    />
  </div>
);

export default AuthInput;