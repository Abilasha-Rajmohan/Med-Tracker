"use client";
import React, { useState } from 'react';
import HealthSyncLogo from '../img/HealthSync.png';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import axios from 'axios';

const RegisterForm: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [dob, setDob] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log('Environment:', process.env.NEXT_PUBLIC_ENVIRONMENT);
    console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Reset messages
        setErrorMessage('');
        setSuccessMessage('');

        // Basic validation
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            // Show error toast
            toast.error('Passwords do not match', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (!email || !password || !firstName || !lastName || !gender || !dob || !phone || !address) {
            setErrorMessage('Please fill all the fields');
            // Show error toast
            toast.error('Please fill all the fields', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (phone.length < 10) {
            setErrorMessage('Please fill a valid phone number');
            // Show error toast
            toast.error('Please fill a valid phone number', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        // Create the user object
        const userData = { 
            first_name: firstName, 
            last_name: lastName, 
            email, 
            password, 
            gender, 
            date_of_birth: dob, 
            phone, 
            address 
        };

        try {
            const response = await axios.post(`${BASE_URL}/patient`, userData);

            if (response.status === 201) {
                setSuccessMessage('Registration successful! You can now log in.');
                // Show success toast
                toast.success('Registration successful! You can now log in.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                // Redirect the user to login page
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                const errorData = response.data;
                // Show error toast
                toast.error(errorData.message || 'Something went wrong', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setErrorMessage(errorData.message || 'Something went wrong');
            }
        } catch (error) {
            console.log('Something went wrong');
            // Show error toast
            toast.error('Something went wrong', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setErrorMessage('Something went wrong');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen p-6">
            {/* Toast Container */}
            <ToastContainer />
            <div className="mb-4 text-center flex items-center">
                <Image
                    src={HealthSyncLogo}
                    alt="HealthSync Logo"
                    width={30}
                    height={30}
                    className="m-3"
                />
                <h1 className="text-4xl font-bold text-blue-600">HealthSync</h1>
            </div>
            <p className="text-sm text-gray-500 mt-0">
                Your health journey, monitored and managed seamlessly
            </p>

            <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">Create an Account</h2>

                {errorMessage && (
                    <div className="text-red-600 bg-red-100 p-2 rounded-md mb-4">{errorMessage}</div>
                )}
                {successMessage && (
                    <div className="text-green-600 bg-green-100 p-2 rounded-md mb-4">{successMessage}</div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* First Name and Last Name */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <select
                            name="gender"
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                        >
                            <option value="" disabled>
                                Select your gender
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dob"
                            id="dob"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <textarea
                            name="address"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 bg-purple-500 text-white font-medium rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
