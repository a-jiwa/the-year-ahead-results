import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

import {
    leaderboardData,
    leaderboardDataUKPolitics,
    leaderboardDataGeopolitics,
    leaderboardDataPopularCulture,
    leaderboardDataCelebrityDeaths,
    leaderboardDataBusiness,
    leaderboardDataSport,
} from '../data/data';

import GoldIcon from '../assets/svgs/gold.svg';
import SilverIcon from '../assets/svgs/silver.svg';
import BronzeIcon from '../assets/svgs/bronze.svg';

const categories = {
    ALL: 'All',
    UK_POLITICS: 'UK Politics',
    GEOPOLITICS: 'Geopolitics',
    POPULAR_CULTURE: 'Popular Culture',
    CELEBRITY_DEATHS: 'Celebrity Deaths',
    BUSINESS: 'Business',
    SPORT: 'Sport',
};

const getAllCategoryScores = () => {
    const allData = {
        [categories.ALL]: leaderboardData,
        [categories.UK_POLITICS]: leaderboardDataUKPolitics,
        [categories.GEOPOLITICS]: leaderboardDataGeopolitics,
        [categories.POPULAR_CULTURE]: leaderboardDataPopularCulture,
        [categories.CELEBRITY_DEATHS]: leaderboardDataCelebrityDeaths,
        [categories.BUSINESS]: leaderboardDataBusiness,
        [categories.SPORT]: leaderboardDataSport,
    };

    const aggregatedScores = {};

    Object.entries(allData).forEach(([category, data]) => {
        data.forEach((user) => {
            if (!aggregatedScores[user.id]) {
                aggregatedScores[user.id] = { name: user.name, scores: {} };
            }
            aggregatedScores[user.id].scores[category] = user.score;
        });
    });

    return aggregatedScores;
};

const getLeaderboardDataForCategory = (category) => {
    switch (category) {
        case categories.UK_POLITICS:
            return leaderboardDataUKPolitics;
        case categories.GEOPOLITICS:
            return leaderboardDataGeopolitics;
        case categories.POPULAR_CULTURE:
            return leaderboardDataPopularCulture;
        case categories.CELEBRITY_DEATHS:
            return leaderboardDataCelebrityDeaths;
        case categories.BUSINESS:
            return leaderboardDataBusiness;
        case categories.SPORT:
            return leaderboardDataSport;
        default:
            return leaderboardData;
    }
};


// Utility function to format names
const formatName = (fullName) => {
    const [firstName, lastName] = fullName.split(' ');
    return lastName ? `${firstName} ${lastName.charAt(0)}.` : firstName;
};

// Function to calculate ranks with ties
const calculateRanks = (data) => {
    let rank = 1;
    return data.map((user, index, array) => {
        if (index > 0 && user.score === array[index - 1].score) {
            user.rank = array[index - 1].rank;
        } else {
            user.rank = rank;
        }
        rank++;
        return user;
    });
};

const Leaderboard = ({ userId: propsUserId, isAccessedViaSpecialLink }) => {
    const [userId, setUserId] = useState(propsUserId);
    const [selectedCategory, setSelectedCategory] = useState(categories.ALL);
    const [expandedRows, setExpandedRows] = useState({});
    const allScores = getAllCategoryScores(); // Get aggregated scores

    useEffect(() => {
        if (!propsUserId) {
            const storedUserId = sessionStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
            }
        }
    }, [propsUserId]);

    // Function to get leaderboard data based on selected category
    const getLeaderboardData = () => {
        switch (selectedCategory) {
            case categories.UK_POLITICS:
                return leaderboardDataUKPolitics;
            case categories.GEOPOLITICS:
                return leaderboardDataGeopolitics;
            case categories.POPULAR_CULTURE:
                return leaderboardDataPopularCulture;
            case categories.CELEBRITY_DEATHS:
                return leaderboardDataCelebrityDeaths;
            case categories.BUSINESS:
                return leaderboardDataBusiness;
            case categories.SPORT:
                return leaderboardDataSport;
            default:
                return leaderboardData;
        }
    };

    const dataToDisplay = calculateRanks(
        getLeaderboardData().sort((a, b) => b.score - a.score)
    );

    console.log("userId:", userId);
    console.log("isAccessedViaSpecialLink:", isAccessedViaSpecialLink);

    // Function to render position icons for top 3
    const renderPositionIcon = (rank) => {
        switch (rank) {
            case 1:
                return <img src={GoldIcon} alt="Gold" className="w-6 h-6" />;
            case 2:
                return <img src={SilverIcon} alt="Silver" className="w-6 h-6" />;
            case 3:
                return <img src={BronzeIcon} alt="Bronze" className="w-6 h-6" />;
            default:
                return null;
        }
    };

    const toggleRowExpansion = (id) => {
        setExpandedRows((prev) => {
            const isSameRow = prev[id];

            // If the same row is being collapsed, clear the state
            if (isSameRow) {
                return {};
            }
            return { [id]: true };
        });
    };



    return (
        <div className="max-w-4xl mx-auto px-4 py-20 overflow-y-scroll">
            <div className="max-w-4xl mx-auto px-4">
                {/* Title and Dropdown Menu */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Rankings</h1>

                    {/* Dropdown Menu */}
                    <div className="relative inline-block text-left w-60">
                        <Menu>
                            <div>
                                <MenuButton
                                    className="inline-flex w-full justify-between items-center gap-x-1.5 rounded-md bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {selectedCategory}
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className="-mr-1 h-5 w-5 text-gray-400"
                                    />
                                </MenuButton>
                            </div>

                            <MenuItems
                                className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                <div className="py-1">
                                    {Object.entries(categories).map(([key, label]) => (
                                        <MenuItem key={key}>
                                            {({active}) => (
                                                <button
                                                    onClick={() => setSelectedCategory(label)}
                                                    className={`${
                                                        active
                                                            ? 'bg-gray-100 text-gray-900'
                                                            : 'text-gray-700'
                                                    } block w-full px-4 py-3 text-left text-sm`}
                                                >
                                                    {label}
                                                </button>
                                            )}
                                        </MenuItem>
                                    ))}
                                </div>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>


            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                    <tr>
                        {/* Empty Column for Arrow */}
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b border-gray-300"></th>

                        {/* Rank Column */}
                        <th className="px-6 py-3 text-center text-sm font-bold text-gray-700 border-b border-gray-300">
                            Rank
                        </th>

                        {/* User Column */}
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 border-b border-gray-300">
                            User
                        </th>

                        {/* Score Column - Right Aligned */}
                        <th className="px-6 py-3 text-right text-sm font-bold text-gray-700 border-b border-gray-300">
                            Score
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {dataToDisplay.map((user) => {
                        const isHighlighted =
                            isAccessedViaSpecialLink &&
                            user.id.trim().toLowerCase() === userId.trim().toLowerCase();
                        const isExpanded = expandedRows[user.id];
                        const userScores = allScores[user.id]?.scores || {};

                        return (
                            <React.Fragment key={user.id}>
                                <tr
                                    id={`row-${user.id}`}
                                    className={`border-b border-gray-300 cursor-pointer select-none transition-all ${
                                        isHighlighted
                                            ? 'bg-green-100' // Highlighted row
                                            : isExpanded
                                                ? 'border-gray-800' // Expanded row with blue top border
                                                : 'hover:bg-gray-50' // Hover effect for unexpanded rows
                                    }`}
                                    onClick={() => toggleRowExpansion(user.id)}
                                >
                                    {/* Arrow Column */}
                                    <td className="pl-4 pr-2 py-4 text-sm font-medium text-gray-900 align-middle w-12">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className={`w-5 h-5 transition-transform ${
                                                expandedRows[user.id] ? 'rotate-90' : ''
                                            }`}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </td>

                                    {/* Rank Column */}
                                    <td className="px-3 py-4 text-sm font-medium text-gray-900 align-middle w-12">
                                        <div
                                            className={`flex items-center justify-center gap-2 transition-opacity duration-100 ${
                                                isExpanded ? 'opacity-0' : 'opacity-100'
                                            }`}
                                        >
                                            {renderPositionIcon(user.rank)}
                                            {user.rank > 3 && <span>{user.rank}</span>}
                                        </div>
                                    </td>

                                    {/* User Column */}
                                    <td
                                        className={`px-6 py-4 text-sm font-medium align-middle ${
                                            isExpanded ? 'font-bold text-gray-900' : 'text-gray-700'
                                        }`}
                                    >
                                        {formatName(user.name)}
                                    </td>

                                    {/* Score Column */}
                                    <td className="px-6 py-4 text-sm font-medium align-middle text-right">
                                        {isExpanded ? (
                                            // Render button only if it's not the user's own row
                                            userId !== user.id ? (
                                                <Link
                                                    to={
                                                        isAccessedViaSpecialLink
                                                            ? `/full-results?primaryUser=${userId}&comparisonUser=${user.id}`
                                                            : `/full-results?primaryUser=${user.id}`
                                                    }
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                >
                                                    {isAccessedViaSpecialLink ? 'Compare' : 'Full Results'}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-500"></span> // Optional fallback text
                                            )
                                        ) : (
                                            <span
                                                className={`transition-opacity duration-300 ${
                                                    isExpanded ? 'opacity-0' : 'opacity-100'
                                                }`}
                                            >
            {user.score.toFixed(2)}
        </span>
                                        )}
                                    </td>


                                </tr>

                                {isExpanded && (
                                    <>
                                        {Object.entries(userScores).map(([category, score], index, array) => {
                                            const categoryRank = calculateRanks(
                                                getLeaderboardDataForCategory(category)
                                            ).find((u) => u.id === user.id)?.rank;

                                            // Determine if this is the first row, second row, or last row
                                            const isFirstRow = index === 0;
                                            const isSecondRow = index === 1;
                                            const isLastRow = index === array.length - 1;

                                            return (
                                                <tr
                                                    key={category}
                                                    className={`${
                                                        isFirstRow
                                                            ? 'border-b border-gray-400 border-solid font-bold' // Solid top border between first and second rows
                                                            : isLastRow
                                                                ? 'border-b border-gray-400 border-solid font-medium' // Solid bottom border for last row
                                                                : 'border-b border-gray-400 border-dashed font-medium' // Dashed borders for all other rows
                                                    } bg-gray-50`}
                                                >
                                                    {/* Blank Column */}
                                                    <td className="px-6 py-4 text-sm text-gray-700 align-middle w-12"></td>

                                                    {/* Rank */}
                                                    <td className="px-3 py-4 text-sm text-gray-900 align-middle text-center">
                                                        {categoryRank || 'N/A'}
                                                    </td>

                                                    {/* Category Name */}
                                                    <td className="px-6 py-4 text-sm text-gray-700 align-middle">
                                                        {categories[category] || category}
                                                    </td>

                                                    {/* Score */}
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-700 align-middle text-right">
                                                        {score.toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                )}


                            </React.Fragment>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
