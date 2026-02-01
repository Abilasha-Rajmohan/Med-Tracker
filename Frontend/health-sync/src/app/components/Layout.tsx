// src/app/components/Layout.tsx

import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode; // Define the type for the children prop
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 bg-gray-100">
                {children} {/* Render the children */}
            </div>
        </div>
    );
};

export default Layout;
