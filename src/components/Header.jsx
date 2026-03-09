import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell, Menu } from 'lucide-react';
import authService from '../services/authServices';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogout = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.logout();
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Logout failed');
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Remove the duplicate async function that was here

    return (
        <header className={`
            bg-white shadow-sm fixed top-0 z-10 h-16 
            flex items-center justify-between px-4 md:px-6
            transition-all duration-300
            ${isSidebarOpen ? 'left-64' : 'left-0 md:left-64'}
            right-0
        `}>
            <div className="flex items-center space-x-4">
                {/* Mobile menu toggle button */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="w-5 h-5 text-gray-600" />
                </button>

                <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                    Invoice App
                </h1>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition"
                        aria-label="User menu"
                    >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-20"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-30 border">
                                <div className="px-4 py-2 border-b md:hidden">
                                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                                    <p className="text-xs text-gray-500">admin@example.com</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    disabled={loading}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 disabled:opacity-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>{loading ? 'Logging out...' : 'Logout'}</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Error Toast */}
            {error && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mb-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
                    {error}
                </div>
            )}
        </header>
    );
};

export default Header;