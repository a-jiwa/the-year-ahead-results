import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ userId }) => {
    const [userName, setUserName] = useState('');
    const userIdFromSession = sessionStorage.getItem('userId');
    const location = useLocation();

    useEffect(() => {
        const activeUserId = userId || userIdFromSession;

        if (activeUserId) {
            const fetchUserName = async () => {
                const users = {
                    1: 'John Doe',
                    2: 'Jane Smith',
                };
                setUserName(users[activeUserId] || '');
            };
            fetchUserName();
        } else {
            setUserName('');
        }
    }, [userId, userIdFromSession]);

    const isActive = (path) => location.pathname === path;

    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-white/70 backdrop-blur-lg shadow">
            <nav className="flex flex-row items-center justify-between p-6 lg:px-8" aria-label="Global">
                {/* Header Text */}
                <div className="flex-1 mb-4 sm:mb-0 relative">
                    <Link to="/" className="text-lg font-bold text-gray-900 hidden sm:inline">
                        TheYearAhead
                    </Link>
                    <p className="absolute top-[70%] left-0 text-sm font-medium text-blue-600 hidden sm:block">
                        Results
                    </p>
                </div>


                {/* Navigation Links */}
                <div className="flex flex-row w-full sm:w-auto sm:gap-x-6 justify-evenly sm:justify-start">
                    <Link
                        to="/"
                        className={`text-center text-sm font-semibold ${
                            isActive('/') ? 'text-blue-600' : 'text-gray-900'
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        to={userId || userIdFromSession ? `/user/${userId || userIdFromSession}/leaderboard` : '/leaderboard'}
                        className={`text-center text-sm font-semibold ${
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
                        className={`text-center text-sm font-semibold ${
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
