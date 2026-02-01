"use client";

import React from "react";
import Link from "next/link";


const Sidebar: React.FC = () => {
    return (
        <aside className="w-full lg:w-1/5 bg-gray-200 text-white flex flex-col items-center py-6 px-4">


            {/* Navigation Links */}
            <nav className="space-y-4 w-full">
                <Link
                    href="/Dashboard"
                    className="block px-4 py-2 text-lg rounded-md hover:bg-purple-500 text-center text-black"
                >
                    My Dashboard
                </Link>
                <Link
                    href="/Provider_details"
                    className="block px-4 py-2 text-lg rounded-md hover:bg-purple-500 text-center text-black"
                >
                    Provider Details
                </Link>
                <Link
                    href="/CurrentHealthInfo"
                    className="block px-4 py-2 text-lg rounded-md hover:bg-purple-500 text-center text-black"
                >
                    Current Health Information
                </Link>
                <Link
                    href="/Medication"
                    className="block px-4 py-2 text-lg rounded-md hover:bg-purple-500 text-center text-black"
                >
                    Medications
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
