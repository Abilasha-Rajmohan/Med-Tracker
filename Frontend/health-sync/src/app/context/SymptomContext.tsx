"use client";
import React, { createContext, useContext, useState } from "react";

// Define the context and type
type SymptomContextType = {
    symptoms: { name: string; intensity: number; time: "AM" | "PM" }[];
    addSymptom: (symptom: { name: string; intensity: number; time: "AM" | "PM" }) => void;
};

const SymptomContext = createContext<SymptomContextType | undefined>(undefined);

// Default implementation (used when no provider is wrapped)
const defaultContextValue: SymptomContextType = {
    symptoms: [],
    addSymptom: () => {
        console.warn("addSymptom called outside of SymptomProvider!");
    },
};

export const SymptomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [symptoms, setSymptoms] = useState<
        { name: string; intensity: number; time: "AM" | "PM" }[]
    >([]);

    const addSymptom = (symptom: { name: string; intensity: number; time: "AM" | "PM" }) => {
        setSymptoms((prevSymptoms) => [...prevSymptoms, symptom]);
    };

    return (
        <SymptomContext.Provider value={{ symptoms, addSymptom }}>
            {children}
        </SymptomContext.Provider>
    );
};

export const useSymptomContext = () => {
    return useContext(SymptomContext) ?? defaultContextValue; // Fallback to default context
};
