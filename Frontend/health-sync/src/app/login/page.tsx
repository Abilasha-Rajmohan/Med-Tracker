// src/app/login/RegisterForm.tsx
"use client";
import React from 'react';
import HealthSyncLogo from '../img/HealthSync.png';
import Image from 'next/image';
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const LoginPage: React.FC = () => {
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log('Environment:', process.env.NEXT_PUBLIC_ENVIRONMENT);
    console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);


    try {
      // Make the login API call
      const response = await axios.post(`${BASE_URL}/patient/login`, {
        email,
        password,
      });

      // Save the token to localStorage
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Save patient details to localStorage
      const patientDetails = response.data.patient_details;
      localStorage.setItem('patientDetails', JSON.stringify(patientDetails));

      /* 
        To access the token use:

        `localStorage.getItem('token');`
        Add this token in the headers of every request like so:
        headers = {
          'Authorization': `Bearer ${token}`
        }

        To access patientDetails object use:

        `JSON.parse(localStorage.getItem('patientDetails'));`
        This should be the patientDetails object: {"patient_id":8,"gender":"F","phone":"+1 32412354","created_on":"2024-11-23T15:43:45.791161","active":true,"first_name":"Dory5","last_name":"Doe","date_of_birth":"1993-01-01","email":"dory5@patient.com","address":"123 elm street, Georgia, AL","updated_on":"2024-11-23T15:43:45.791172"}
      */

      // Show success toast
      toast.success('Login successful! Redirecting to dashboard...', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect the user to a protected route (e.g., dashboard) after a short delay
      setTimeout(() => {
        window.location.href = '/Dashboard';
      }, 3000);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      // Handle errors and show error toast
      toast.error(error.response?.data?.detail || 'Invalid credentials. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error: ', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Toast Container */}
      <ToastContainer />
      {/* Header Section */}
      <div className="mb-4 text-center flex items-center">
        <Image src={HealthSyncLogo}
          alt="HealthSync Logo"
          width={30}
          height={30}
          className="m-3"
        />
        <h1 className="text-4xl font-bold text-blue-600"> HealthSync</h1>
      </div>
        <p className="text-sm text-gray-500 mt-0">
          Your health journey, monitored and managed seamlessly
        </p>


      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">Sign-in to streamline your path to wellness</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Type your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Type your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <a href="/signup" className="text-black-500">
            Dont have an account?
          </a>
          <span className="mx-1"> </span>
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
          <span className="mx-2">|</span>
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
