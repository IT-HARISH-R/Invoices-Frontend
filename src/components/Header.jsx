import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authServices';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const response = await authService.logout();
            navigate('/login');

        } catch (err) {
            setError(err.message || 'Invalid email or password');
        }

    };

    async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            const response = await authService.login({ email, password });

            if (response.token) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="bg-white shadow-sm fixed top-0 right-0 left-64 z-10 h-16 flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold text-gray-800">Invoice App</h1>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Logout
            </button>
        </header>
    );
};

export default Header;