import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ userId }) => {
    const [userName, setUserName] = useState('');
    const userIdFromSession = sessionStorage.getItem('userId'); // Retrieve userId from session storage if available
    const location = useLocation(); // Get the current route

    useEffect(() => {
        const activeUserId = userId || userIdFromSession;

        if (activeUserId) {
            // Simulate fetching user data
            const fetchUserName = async () => {
                const users = {
                    1: 'John Doe',
                    2: 'Jane Smith',
                }; // Mocked user data
                setUserName(users[activeUserId] || '');
            };
            fetchUserName();
        } else {
            setUserName('');
        }
    }, [userId, userIdFromSession]);

    // Function to check if the link is active
    const isActive = (path) => location.pathname === path;

    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-white/70 backdrop-blur-lg shadow">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                {/* Header Text */}
                <div className="flex-1">
                    <Link to="/" className="text-lg font-bold text-gray-900">
                        TheYearAhead
                    </Link>
                </div>

                {/* Navigation Links - Visible on all screen sizes */}
                <div className="flex gap-x-6">
                    <Link
                        to="/"
                        className={`text-sm font-semibold ${
                            isActive('/') ? 'text-blue-600' : 'text-gray-900'
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        to={userId || userIdFromSession ? `/user/${userId || userIdFromSession}/leaderboard` : '/leaderboard'}
                        className={`text-sm font-semibold ${
                            isActive(
                                userId || userIdFromSession
                                    ? `/user/${userId || userIdFromSession}/leaderboard`
                                    : '/leaderboard'
                            )
                                ? 'text-blue-600'
                                : 'text-gray-900'
                        }`}
                    >
                        Leaderboard
                    </Link>
                    <Link
                        to={userId || userIdFromSession ? `/user/${userId || userIdFromSession}/full-results` : '/full-results'}
                        className={`text-sm font-semibold ${
                            isActive(
                                userId || userIdFromSession
                                    ? `/user/${userId || userIdFromSession}/full-results`
                                    : '/full-results'
                            )
                                ? 'text-blue-600'
                                : 'text-gray-900'
                        }`}
                    >
                        Full Results
                    </Link>
                </div>

                {/* User Greeting */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {userName && (
                        <span className="text-sm font-semibold text-gray-900">Hello, {userName}</span>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
