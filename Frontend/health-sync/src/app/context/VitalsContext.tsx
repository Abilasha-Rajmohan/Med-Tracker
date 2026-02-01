// context/VitalsContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure of a single vital object
interface Vital {
    type: string;
    value: string;
    notes: string;
}

// Define the context type for vitals
interface VitalsContextType {
    vitals: Vital[];
    addVital: (vital: Vital) => void;
    removeVital: (index: number) => void; // New removeVital function
}

// Create a context with an undefined default value
const VitalsContext = createContext<VitalsContextType | undefined>(undefined);

// Custom hook to use vitals context safely
export const useVitalsContext = (): VitalsContextType => {
    const context = useContext(VitalsContext);
    if (!context) {
        throw new Error('useVitalsContext must be used within a VitalsProvider');
    }
    return context;
};

// VitalsProvider component to manage the state of vitals
export const VitalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [vitals, setVitals] = useState<Vital[]>([]);

    // Function to add a new vital
    const addVital = (vital: Vital) => {
        setVitals((prevVitals) => [...prevVitals, vital]);
    };

    // Function to remove a vital by its index
    const removeVital = (index: number) => {
        setVitals((prevVitals) => prevVitals.filter((_, i) => i !== index));
    };

    return (
        <VitalsContext.Provider value={{ vitals, addVital, removeVital }}>
            {children}
        </VitalsContext.Provider>
    );
};
