// pages/provider-details.tsx
"use client";

import React, { useState, useEffect } from "react";
import HealthSyncLogo from "@/app/img/HealthSync.png";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "@/app/components/Layout";
import axios from "axios";



const ProviderDetails: React.FC = () => {

    const [formData, setFormData] = useState({
        name: "",
        npi_number: "",
        speciality: "",
        speciality_type: "",
        email: "",
        phone: "",
        primary_facility: "",
        patient_since: "",
    });
    const [isReadOnly, setIsReadOnly] = useState(false);

    const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);

    const [userName, setUserName] = useState<string>("User Name"); // State for user name

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log('Environment:', process.env.NEXT_PUBLIC_ENVIRONMENT);
    console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

    // Fetch user name from local storage
    useEffect(() => {
        const patientDetails = JSON.parse(localStorage.getItem("patientDetails") || '');
        const fullName = (patientDetails.first_name + ' ' + patientDetails.last_name).trim();
        const patientId = patientDetails.patient_id;
        const token = localStorage.getItem("token")

        if (fullName) {
            setUserName(`${fullName}`);
        } else {
            setUserName('User Name');
        }
        const fetchProviderDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/patient/${patientId}/provider`, { headers: {"Authorization" : `Bearer ${token}`} });
        
                if (response.status == 200) {
                    const data = await response.data;
        
                    if (data) {
                    setFormData({
                        name: data.name,
                        npi_number: data.npi_number,
                        speciality_type: data.speciality_type,
                        speciality: data.speciality,
                        phone: data.phone,
                        email: data.email,
                        primary_facility: data.primary_facility,
                        patient_since: data.patient_since,
                    });
                    setIsReadOnly(true); // Make fields read-only
                    }
                } else {
                    console.error("Error fetching provider details");
                }
            } catch (error) {
            console.error("Error fetching provider details", error);
            }
        }
        fetchProviderDetails();
    }, []);

    // Handle input changes for text fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle date picker changes
    // Handle date picker changes
    const handleDateChange = (date: string | null) => {
        if (date) {
            setFormData((prev) => ({ ...prev, patientSince: date }));
        }
    };

    // Format date for display
    const formatDate = (date: String) => {
        return date;
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Provider Details Submitted: ", formData);

        const patientDetails = JSON.parse(localStorage.getItem("patientDetails") || '');
        const patientId = patientDetails.patient_id;
        const token = localStorage.getItem("token")

        // Save submitted data
        setSubmittedData(formData);

        // Clear the form
        // setFormData({
        //     name: "",
        //     npi_number: "",
        //     speciality: "",
        //     speciality_type: "",
        //     email: "",
        //     phone: "",
        //     primary_facility: "",
        //     patient_since: "",
        // });

        const saveProviderDetails = async () => {
            try {
                const response = await axios.put(`${BASE_URL}/patient/${patientId}/provider`, formData, { headers: {"Authorization" : `Bearer ${token}`} });
        
                if (response.status == 201) {
                    const data = await response.data;
        
                    if (data) {
                        setFormData({
                            name: data.name,
                            npi_number: data.npi_number,
                            speciality_type: data.speciality_type,
                            speciality: data.speciality,
                            phone: data.phone,
                            email: data.email,
                            primary_facility: data.primary_facility,
                            patient_since: data.patient_since,
                        });
                        setIsReadOnly(true); // Make fields read-only
                    }
                } else {
                    console.error("Error saving provider details");
                }
            } catch (error) {
                console.error("Error saving provider details", error);
            }
        }
        saveProviderDetails();
    };

    return (

        <Layout>
            <div
                style={{
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "white",
                    color: "black",
                    minHeight: "100vh",
                    padding: "20px",
                }}
            >
                {/* Header */}
                <header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#e6e6fa",
                        padding: "10px 20px",
                        borderRadius: "8px",
                    }}
                >
                    {/* Centered Title Section */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            textAlign: "center",
                            flexGrow: 1,
                            justifyContent: "center",
                        }}
                    >
                        {/* Logo */}
                        <img
                            src={HealthSyncLogo.src}
                            alt="HealthSync Logo"
                            width={40}
                            height={40}
                            style={{marginRight: "10px"}}
                        />
                        {/* Title and Slogan */}
                        <div>
                            <h1
                                style={{
                                    color: "#6a0dad",
                                    fontWeight: "bold",
                                    fontSize: "24px",
                                    margin: "0",
                                }}
                            >
                                HealthSync
                            </h1>
                            <p style={{fontSize: "14px", color: "gray", margin: "4px 0 0 0"}}>
                                Your health journey, monitored and managed seamlessly
                            </p>
                        </div>
                    </div>

                    {/* User Info */}
                    <div style={{textAlign: "right"}}>
                        <p style={{margin: 0, fontSize: "14px", fontWeight: "bold"}}>
                            {userName}
                        </p>
                    </div>
                </header>


                <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow-md">
                    {/* Provider Details Form */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-purple-600 mb-4">Provider Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Provider Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="npi_number" className="block text-sm font-medium text-gray-700">Provider
                                    NPI</label>
                                <input
                                    type="text"
                                    name="npi_number"
                                    id="npi_number"
                                    value={formData.npi_number}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="speciality_type"
                                       className="block text-sm font-medium text-gray-700">Specialization Type</label>
                                <select
                                    name="speciality_type"
                                    id="speciality_type"
                                    value={formData.speciality_type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"
                                    required
                                >
                                    <option value="">Select Specialization</option>
                                    <option value="General Practitioner">General Practitioner</option>
                                    <option value="Specialist">Specialist</option>
                                    <option value="Consultant">Consultant</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="speciality"
                                       className="block text-sm font-medium text-gray-700">Specialization</label>
                                <input
                                    name="speciality"
                                    id="speciality"
                                    type="text"
                                    value={formData.speciality}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone
                                    Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="primary_facility" className="block text-sm font-medium text-gray-700">Primary
                                    Facility</label>
                                <input
                                    type="text"
                                    name="primary_facility"
                                    id="primary_facility"
                                    value={formData.primary_facility}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"

                                />
                            </div>

                            <div>
                                <label htmlFor="patientSince" className="block text-sm font-medium text-gray-700">
                                    Patient Since
                                </label>
                                <input
                                    type="date"
                                    name="patientSince"
                                    id="patientSince"
                                    value={formData.patient_since}
                                    onChange={(e) => setFormData({ ...formData, patient_since: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                                />
                            </div>

                            <div className="flex justify-center items-center">
                            {!isReadOnly && (
                                <button
                                    type="submit"
                                    className="px-2 py-1 bg-purple-500 text-white text-sm font-medium rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                                >
                                    Save
                                </button>
                            )}
                            </div>

                        </form>
                    </section>

                    {/* Display Submitted Provider Details */}
                    {/* {submittedData && (
                        <section className="mt-8">
                            <h2 className="text-2xl font-bold text-purple-600 mb-4">Submitted Provider Details</h2>
                            <div className="space-y-2">
                                <p>
                                    <strong>Name:</strong> {submittedData.name}
                                </p>
                                <p>
                                    <strong>NPI:</strong> {submittedData.npi_number}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {submittedData.phone}
                                </p>
                                <p>
                                    <strong>Patient Since:</strong> {formatDate(submittedData.patient_since)}
                                </p>
                            </div>
                        </section>
                    )} */}
                </div>
            </div>
        </Layout>
    );
};

export default ProviderDetails;
