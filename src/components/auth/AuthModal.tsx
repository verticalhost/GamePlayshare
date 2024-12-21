import React from 'react';
import AuthForm from './AuthForm';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 p-2 bg-gray-800 rounded-full hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        <AuthForm onSuccess={onClose} />
      </div>
    </div>
  );
};

export default AuthModal;