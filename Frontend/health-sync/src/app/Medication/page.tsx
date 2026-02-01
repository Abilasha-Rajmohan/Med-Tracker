"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/app/components/Layout";
import { SymptomProvider, useSymptomContext } from "@/app/context/SymptomContext";
import HealthSyncLogo from "@/app/img/HealthSync.png";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for the date picker

const Medication: React.FC = () => {
    const { addSymptom } = useSymptomContext();

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log('Environment:', process.env.NEXT_PUBLIC_ENVIRONMENT);
    console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

    // Symptom states
    const [symptomName, setSymptomName] = useState("");
    const [intensity, setIntensity] = useState<number>(1);
    const [time, setTime] = useState<"AM" | "PM">("AM");
    const [symptoms, setSymptoms] = useState<
        { name: string; intensity: number; time: "AM" | "PM" }[]
    >([]);

    // Medication states
    const [medicationName, setMedicationName] = useState("");
    const [selectedMedications, setSelectedMedications] = useState<
        {
            medication_name: string;
            dosage: string;
            dosage_unit: string;
            dosage_frequency: string;
            dosage_form: string;
            medication_info: string;
            medication_start_date: string; // This will be the start date in MM/dd/yyyy format
            notes: string;
            created_on: string; // Timestamp of when the medication was added
            updated_on: string; // Timestamp of the last update
            active: boolean;
        }[]
    >([]);
    const [dosage, setDosage] = useState("");
    const [dosageFrequency, setDosageFrequency] = useState("");
    const [dosageUnit, setDosageUnit] = useState("");
    const [dosageForm, setDosageForm] = useState("");
    const [medicationInfo, setMedicationInfo] = useState("");
    const [medicationStartDate, setMedicationStartDate] = useState<Date | null>(null);
    const [notes, setNotes] = useState("");

    // Load medications from localStorage on mount
    useEffect(() => {
        const storedMedications = localStorage.getItem("medicationDetails");
        if (storedMedications) {
            setSelectedMedications(JSON.parse(storedMedications));
        }
    }, []); // Only run on mount

    // Add Symptom Handler
    const handleSymptomSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!symptomName.trim()) {
            toast.error("Symptom name cannot be empty");
            return;
        }

        const newSymptom = { name: symptomName, intensity, time };
        addSymptom(newSymptom); // Call context method
        setSymptoms((prev) => [...prev, newSymptom]); // Update local list
        setSymptomName(""); // Clear input
        toast.success("Symptom added successfully!");
    };

    // Add Medication Handler
    const handleMedicationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !medicationName.trim() ||
            !dosage ||
            !dosageFrequency ||
            !dosageUnit ||
            !dosageForm ||
            !medicationStartDate
        ) {
            toast.error("Please fill out all medication details.");
            return;
        }

        const newMedication = {
            medication_name: medicationName,
            dosage,
            dosage_unit: dosageUnit,
            dosage_frequency: dosageFrequency,
            dosage_form: dosageForm,
            medication_info: medicationInfo,
            medication_start_date: medicationStartDate?.toLocaleDateString("en-US"),
            notes,
            created_on: new Date().toISOString(),
            updated_on: new Date().toISOString(),
            active: true,
        };

        try {
        const response = await axios.post(`${BASE_URL}/patient/medication`,
                newMedication
            );
            console.log(response.data); // Log the response to check structure

            const updatedMedications = response.data.medications || [];

            // Update medications in state and local storage
            setSelectedMedications(updatedMedications);
            localStorage.setItem("medicationDetails", JSON.stringify(updatedMedications));

            // Clear form fields
           // setMedicationName("");
            //setDosage("");
            //setDosageFrequency("");
            //setDosageUnit("");
           // setDosageForm("");
            //setMedicationInfo("");
            //setMedicationStartDate(null);
            //setNotes("");

            toast.success("Medication added successfully!");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to add medication. Please try again.");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <SymptomProvider>
            <Layout>
                <div className="min-h-screen bg-white text-black p-6">
                    <header className="flex justify-center items-center bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <Image src={HealthSyncLogo.src} alt="HealthSync Logo" width={40} height={40}/>
                            <div>
                                <h1 className="text-2xl font-bold text-purple-600">HealthSync</h1>
                                <p className="text-sm text-gray-500">Your health journey, monitored seamlessly</p>
                            </div>
                        </div>
                    </header>

                    <section className="mt-6 grid grid-cols-3 gap-6">
                        {/* Left Column (Forms) */}
                        <div className="col-span-2 space-y-6">
                            {/* Medications Form */}
                            <div>
                                <h2 className="text-xl font-semibold text-purple-700 mb-4">Add Medication</h2>
                                <form onSubmit={handleMedicationSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        className="border p-2 w-full"
                                        placeholder="Medication name"
                                        value={medicationName}
                                        onChange={(e) => setMedicationName(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="border p-2 w-full"
                                        placeholder="Dosage"
                                        value={dosage}
                                        onChange={(e) => setDosage(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="border p-2 w-full"
                                        placeholder="Frequency"
                                        value={dosageFrequency}
                                        onChange={(e) => setDosageFrequency(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="border p-2 w-full"
                                        placeholder="Unit (e.g., mg)"
                                        value={dosageUnit}
                                        onChange={(e) => setDosageUnit(e.target.value)}
                                    />
                                    <select
                                        className="border p-2 w-full"
                                        value={dosageForm}
                                        onChange={(e) => setDosageForm(e.target.value)}
                                    >
                                        <option value="">Select Form</option>
                                        <option value="Tablet">Tablet</option>
                                        <option value="Capsule">Capsule</option>
                                        <option value="Injection">Injection</option>
                                        <option value="Patch">Patch</option>
                                    </select>
                                    <textarea
                                        className="border p-2 w-full"
                                        placeholder="Medication Info"
                                        value={medicationInfo}
                                        onChange={(e) => setMedicationInfo(e.target.value)}
                                    />
                                    <DatePicker
                                        className="border p-2 w-full"
                                        selected={medicationStartDate}
                                        onChange={(date: Date | null) => setMedicationStartDate(date)}
                                        dateFormat="MM/dd/yyyy"
                                        placeholderText="Select Start Date"
                                    />
                                    <textarea
                                        className="border p-2 w-full"
                                        placeholder="Additional Notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                    <div className="flex justify-center mt-4">
                                        <button className="bg-purple-600 text-white p-2 rounded w-auto">
                                            Add Medication
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Symptoms Form */}
                            <div>
                                <h2 className="text-xl font-semibold text-purple-700 mb-4">Add Symptom</h2>
                                <form onSubmit={handleSymptomSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        className="border p-2 w-full"
                                        placeholder="Symptom Name"
                                        value={symptomName}
                                        onChange={(e) => setSymptomName(e.target.value)}
                                    />
                                    <div>
                                        <label>
                                            Intensity ({intensity} - {getSeverityLabel(intensity)})
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={intensity}
                                            onChange={(e) => setIntensity(Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex space-x-4">
                                        <label>
                                            <input
                                                type="radio"
                                                value="AM"
                                                checked={time === "AM"}
                                                onChange={() => setTime("AM")}
                                            />
                                            AM
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                value="PM"
                                                checked={time === "PM"}
                                                onChange={() => setTime("PM")}
                                            />
                                            PM
                                        </label>
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <button className="bg-purple-600 text-white p-2 rounded w-auto">
                                            Add Symptom
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="bg-purple-50 p-4 rounded-md shadow-sm">
                            <h2 className="text-xl font-semibold mb-4 text-purple-700">Current Medications</h2>
                            <ul>
                                {selectedMedications.length > 0 ? (
                                    selectedMedications.map((medication, index) => (
                                        <li key={index}>{medication.medication_name}</li>
                                    ))
                                ) : (
                                    <li>No medications added yet.</li>
                                )}
                            </ul>

                            <h2 className="text-xl font-semibold mt-6 text-purple-700">Current Symptoms</h2>
                            <ul>
                                {symptoms.length > 0 ? (
                                    symptoms.map((symptom, index) => (
                                        <li key={index}>
                                            <strong>{symptom.name}</strong> -
                                            Intensity: {symptom.intensity} ({getSeverityLabel(symptom.intensity)}),
                                            Time: {symptom.time}
                                        </li>
                                    ))
                                ) : (
                                    <li>No symptoms added yet.</li>
                                )}
                            </ul>
                        </div>
                    </section>
                </div>
            </Layout>
        </SymptomProvider>
    );
};

function getSeverityLabel(intensity: number) {
    if (intensity <= 3) return "Mild";
    if (intensity <= 7) return "Moderate";
    return "Severe";
}

export default Medication;
