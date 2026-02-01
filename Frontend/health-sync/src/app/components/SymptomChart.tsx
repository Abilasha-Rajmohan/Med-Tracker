"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Symptom {
    name: string;
    intensity: number;
    time: "AM" | "PM";
}

interface SymptomChartProps {
    symptoms: Symptom[];
}

export const SymptomChart: React.FC<SymptomChartProps> = ({ symptoms }) => {
    // Prepare data for the chart
    const data = {
        labels: symptoms.map((symptom, index) => `Symptom ${index + 1}`), // X-axis labels
        datasets: [
            {
                label: "Symptom Intensity",
                data: symptoms.map((symptom) => symptom.intensity), // Y-axis values
                borderColor: "#6a0dad",
                backgroundColor: "rgba(106, 13, 173, 0.2)",
                borderWidth: 2,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Symptom Intensity Over Time",
            },
        },
    };

    return <Line data={data} options={options} />;
};
