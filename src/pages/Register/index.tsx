import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { RegisterForm } from './RegisterForm';

export function Register() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  return (
    

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <RegisterForm onError={setError} onSuccess={() => navigate('/login')} />
        </div>

     
  );
}