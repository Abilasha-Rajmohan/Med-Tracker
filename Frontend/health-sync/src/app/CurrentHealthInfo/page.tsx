"use client";
import React, { useState } from 'react';
import HealthSyncLogo from '../img/HealthSync.png';
import Layout from "@/app/components/Layout";

const CurrentHealthInfo: React.FC = () => {
    const [healthConditions, setHealthConditions] = useState<{ condition: string; notes: string }[]>([]);
    const [vitals, setVitals] = useState<{ type: string; value: string; notes: string }[]>([]);

    const vitalTypes = ["Blood Pressure", "Heart Rate", "Temperature", "Oxygen Saturation"];

    const handleAddCondition = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const condition = formData.get('condition') as string;
        const notes = formData.get('conditionNotes') as string;

        setHealthConditions((prev) => [...prev, { condition, notes }]);
        event.currentTarget.reset();
    };

    const handleAddVitals = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const type = formData.get('type') as string;
        const value = formData.get('value') as string;
        const notes = formData.get('notes') as string;

        setVitals((prev) => [...prev, { type, value, notes }]);
        event.currentTarget.reset();
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
                    display: "flex",
                }}
            >
                {/* Left Side Form */}
                <div style={{ flex: 1, marginRight: "20px" }}>
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
                        {/* Logo */}
                        <img
                            src={HealthSyncLogo.src}
                            alt="HealthSync Logo"
                            width={40}
                            height={40}
                            style={{ marginRight: "10px" }}
                        />
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
                            <p style={{ fontSize: "14px", color: "gray", margin: "4px 0 0 0" }}>
                                Your health journey, monitored and managed seamlessly
                            </p>
                        </div>
                    </header>

                    <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow-md">
                        {/* Current Health Info Section */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-purple-600 mb-4">Current Health Information</h2>
                            <form onSubmit={handleAddCondition} className="space-y-4">
                                <div>
                                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                                        Current Health Condition
                                    </label>
                                    <input
                                        type="text"
                                        name="condition"
                                        id="condition"
                                        placeholder="Enter condition"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <textarea
                                    name="conditionNotes"
                                    id="conditionNotes"
                                    placeholder="Add notes here..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                                <div className="flex justify-center items-center">
                                    <button
                                        type="submit"
                                        className="px-2 py-1 bg-purple-500 text-white text-sm font-medium rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Vitals Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-purple-600 mb-4">Vitals</h2>
                            <form onSubmit={handleAddVitals} className="space-y-4">
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                        Type
                                    </label>
                                    <select
                                        name="type"
                                        id="type"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="">Select vital type</option>
                                        {vitalTypes.map((type, index) => (
                                            <option key={index} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                                        Value
                                    </label>
                                    <input
                                        type="text"
                                        name="value"
                                        id="value"
                                        placeholder="Enter value"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        id="notes"
                                        placeholder="Add notes here..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div className="flex justify-center items-center">
                                    <button
                                        type="submit"
                                        className="px-2 py-1 bg-purple-500 text-white text-sm font-medium rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>

                {/* Right Side Display */}
                {/* Right Side Display */}
                <div
                    style={{
                        flex: 0.4, // Adjusted flex to make it narrower
                        maxWidth: "300px", // Set a maximum width for the section
                        backgroundColor: "#f9f9f9",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a subtle shadow for better aesthetics
                    }}
                >
                    <h2 className="text-2xl font-bold text-purple-600 mb-4">Current Entries</h2>
                    <h3 className="text-xl font-bold mb-2">Health Conditions</h3>
                    <ul className="list-disc pl-6 mb-6">
                        {healthConditions.map((item, index) => (
                            <li key={index}>
                                <strong>{item.condition}:</strong> {item.notes}
                            </li>
                        ))}
                    </ul>
                    <h3 className="text-xl font-bold mb-2">Vitals</h3>
                    <ul className="list-disc pl-6">
                        {vitals.map((vital, index) => (
                            <li key={index}>
                                <strong>{vital.type}:</strong> {vital.value} ({vital.notes})
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </Layout>
    );
};

export default CurrentHealthInfo;
