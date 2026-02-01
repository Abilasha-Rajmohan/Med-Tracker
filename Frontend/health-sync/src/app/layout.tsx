import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SymptomProvider } from "@/app/context/SymptomContext";
import { VitalsProvider } from "@/app/context/VitalsContext"; // Import the VitalsProvider

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "HealthSync",
    description: "Your health journey, monitored and managed seamlessly",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {/* Wrap children with both context providers */}
        <SymptomProvider>
            <VitalsProvider>
                {children} {/* Your app's content goes here */}
            </VitalsProvider>
        </SymptomProvider>
        </body>
        </html>
    );
}
