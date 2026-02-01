"use client";

import React from "react";
import Layout from "@/app/components/Layout"; // Sidebar layout
import { SymptomChart } from "@/app/components/SymptomChart"; // Chart component
import { useSymptomContext } from "@/app/context/SymptomContext";
import { useVitalsContext } from "@/app/context/VitalsContext";

const Dashboard: React.FC = () => {
    const { symptoms } = useSymptomContext(); // Access global symptom context
    const { vitals } = useVitalsContext();// Access global vital context

    return (
        <Layout>

            <div className="p-8" style={{ backgroundColor: "white", color: "black" }}>
                <h1 className="text-2xl font-bold mb-6 text-purple-700">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Total Symptoms */}
                    <div className="bg-purple-100 p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">Total Symptoms</h2>
                        <p className="text-4xl font-bold">{symptoms.length}</p>
                    </div>

                    {/* Card 2: Total Medications */}
                    <div className="bg-purple-100 p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">Total Medications</h2>
                        <p className="text-4xl font-bold">3</p> {/* Replace with dynamic medication count */}
                    </div>

                    {/* Card 3: Most Frequent Symptom */}
                    <div className="bg-purple-100 p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">Most Frequent Symptom</h2>
                        <p className="text-xl">
                            {symptoms.length > 0
                                ? symptoms
                                    .sort(
                                        (a, b) =>
                                            symptoms.filter((sym) => sym.name === b.name).length -
                                            symptoms.filter((sym) => sym.name === a.name).length
                                    )[0].name
                                : "N/A"}
                        </p>
                    </div>
                </div>
                {/* Vitals Section */}
                <div className="bg-gray-100 p-6 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-purple-700">Vitals</h2>
                    <div className="space-y-4">
                        {vitals.map((vital, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <span>{vital.type}</span>
                                <span>{vital.value}</span>
                                <span>{vital.notes}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4 text-purple-700">Symptom Intensity Chart</h2>
                    <SymptomChart symptoms={symptoms} />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
