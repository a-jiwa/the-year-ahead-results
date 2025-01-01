import React from 'react';
import { leaderboardData } from '../data/data'; // Import the data from data.js

const Leaderboard = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/*<h1 className=" text-left text-3xl font-neueHaas mb-8">Leaderboard</h1>*/}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
                            Position
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
                            User
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
                            Score
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {leaderboardData.map((user, index) => (
                        <tr key={user.id} className="border-b border-gray-300">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                {user.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                {user.score}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
