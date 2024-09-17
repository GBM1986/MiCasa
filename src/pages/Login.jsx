import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../providers/AuthProvider';

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { handleLogin, loginData } = useAuth();
  const [loginMessage, setLoginMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await handleLogin(data.email, data.password);
  
      // Check the response directly from handleLogin
      if (response && response.user) {
        setLoginMessage(`Welcome back, ${response.user.email}!`);
      } else {
        setLoginMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginMessage('Login failed. Please try again.');
    }
  };
  

  const isLoggedIn = loginData && loginData.user;

  return (
      <div className="h-screen bg-white w-[1440px] mx-auto p-10">
        {!isLoggedIn ? (
          <>
            <h2 className="text-heading-1  mb-4">Login</h2>
            <p className="text-heading-4 mb-2">Indtast dit brugernavn og adgangskode for at logge ind</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[490px] space-y-2">
              <div>
                <input
                  type="email"
                  placeholder="Indast dit brugernavn"
                  {...register('email', { required: 'brugernavn is required' })}
                  className="border px-3 py-2 rounded-md w-full"
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Indast din adgangskode"
                  {...register('password', { required: 'adgangskode is required' })}
                  className="border px-3 py-2 rounded-md w-full"
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>
              <div className='flex'>
                <button
                  type="submit"
                  className="bg-lavender text-raisin-black px-6 py-2 rounded-md shadow-lg font-semibold hover:bg-thistle"
                >
                  Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className='max-w-md mx-auto'>
            <p className='mt-4 p-2 border rounded-md bg-green-100 text-green-800'>{loginMessage}</p>
          </div>
        )}
      </div>
  );
};
