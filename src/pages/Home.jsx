import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    leaderboardData,
    questions,
    userAnswers,
    allUserResponses,
    userBestPredictionsMap,
    userWorstPredictionsMap,
} from '../data/data'; // Import new data structures
import Question from '../components/Question';

const Home = ({ userId, isAccessedViaSpecialLink }) => {
    const [userName, setUserName] = useState('');
    const [topPlayers, setTopPlayers] = useState([]);
    const [userPosition, setUserPosition] = useState(null);
    const [userScore, setUserScore] = useState(null);

    // Get questions for best and worst predictions
    const bestQuestionsToShow = userId
        ? (userBestPredictionsMap[userId] || []).map((questionId) =>
            questions.find((q) => q.id === questionId)
        )
        : [];
    const worstQuestionsToShow = userId
        ? (userWorstPredictionsMap[userId] || []).map((questionId) =>
            questions.find((q) => q.id === questionId)
        )
        : [];

    const getOrdinalSuffix = (rank) => {
        if (!rank) return '';
        const remainder = rank % 10;
        const tens = Math.floor(rank / 10) % 10;

        if (tens === 1) return `${rank}th`; // Handles 11th, 12th, 13th, etc.
        if (remainder === 1) return `${rank}st`;
        if (remainder === 2) return `${rank}nd`;
        if (remainder === 3) return `${rank}rd`;
        return `${rank}th`;
    };

    useEffect(() => {
        if (userId) {
            // Find user data
            const user = leaderboardData.find((u) => u.id === userId);
            setUserName(user ? user.name : '');
            setUserScore(user ? user.score : null); // Store user's score

            if (user) {
                // Sort leaderboard data by score in descending order
                const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.score - a.score);

                // Find user position
                const position = sortedLeaderboard.findIndex((u) => u.id === userId) + 1;
                setUserPosition(position);
            } else {
                setUserPosition(null); // Reset if user not found
            }
        } else {
            setUserName('');
            setUserScore(null); // Reset score if no userId
            setUserPosition(null); // Reset position if no userId
        }

        // Fetch top 5 players
        const fetchTopPlayers = () => {
            const topPlayers = leaderboardData
                .slice(0, 5)
                .sort((a, b) => b.score - a.score);
            setTopPlayers(topPlayers);
        };

        fetchTopPlayers();
    }, [userId]);

    return (
        <div className="relative isolate px-6 pt-14 lg:px-8">
            {/* Introduction Section */}
            <div className="mt-16 mx-auto max-w-4xl">
                <h2 className="text-3xl font-semibold text-gray-900">The Year Ahead Results</h2>

                {userName && (
                    <p className="mt-4 text-lg text-gray-800">
                        Hello, <span className="font-semibold">{userName.split(' ')[0]}</span>!
                        You ranked <span className="font-semibold">{getOrdinalSuffix(userPosition)}</span> out of
                        <span className="font-semibold"> {leaderboardData.length} </span> participants.
                        Your final score was <span className="font-semibold">{userScore}</span>.
                    </p>
                )}

                <p className="mt-4 text-lg leading-7 text-gray-600">
                    At the start of the year, you joined our competition to predict the likelihood of future events.
                    Your task was to assign probabilities to a series of binary outcomes, testing your ability to forecast
                    accurately and gauge uncertainty. We’ve now compared your predictions to the actual outcomes to evaluate
                    your accuracy using the Brier Score, a measure of how close your forecasts were to reality.
                </p>
                <p className="mt-4 text-lg leading-7 text-gray-600">
                    The results are in! See how well you did, how you compare to others, and explore the detailed rankings below.
                </p>
            </div>

            {/* Best Predictions Section */}
            {userId && bestQuestionsToShow.length > 0 && (
                <div className="mt-16 mx-auto max-w-4xl">
                    <h2 className="text-3xl font-semibold text-gray-900">Your Best Predictions</h2>
                    <div className="mt-8 space-y-6">
                        {bestQuestionsToShow.map((question) => {
                            const userAnswer = userAnswers[userId]?.[question.id] || null;
                            const groupAverage = question.groupAverage;
                            const otherUserResponses = allUserResponses[question.id] || [];

                            return (
                                <Question
                                    key={question.id}
                                    question={question}
                                    userAnswer={userAnswer}
                                    comparisonAnswer={null}
                                    groupAverage={groupAverage}
                                    otherUserResponses={otherUserResponses}
                                    userName={userName || 'You'}
                                    comparisonUserName={null}
                                    showDescription={true}
                                    showDetails={false}
                                    showOtherUserLines={true}
                                    showMathSection={false}
                                    isAccessedViaSpecialLink={isAccessedViaSpecialLink}
                                    specialUserId={isAccessedViaSpecialLink ? userId : null}
                                    selectedUser={{ id: userId, name: userName }}
                                    comparisonUser={null}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Worst Predictions Section */}
            {userId && worstQuestionsToShow.length > 0 && (
                <div className="mt-16 mx-auto max-w-4xl">
                    <h2 className="text-3xl font-semibold text-gray-900">Your Worst Predictions</h2>
                    <div className="mt-8 space-y-6">
                        {worstQuestionsToShow.map((question) => {
                            const userAnswer = userAnswers[userId]?.[question.id] || null;
                            const groupAverage = question.groupAverage;
                            const otherUserResponses = allUserResponses[question.id] || [];

                            return (
                                <Question
                                    key={question.id}
                                    question={question}
                                    userAnswer={userAnswer}
                                    comparisonAnswer={null}
                                    groupAverage={groupAverage}
                                    otherUserResponses={otherUserResponses}
                                    userName={userName || 'You'}
                                    comparisonUserName={null}
                                    showDescription={true}
                                    showDetails={false}
                                    showOtherUserLines={true}
                                    showMathSection={false}
                                    isAccessedViaSpecialLink={isAccessedViaSpecialLink}
                                    specialUserId={isAccessedViaSpecialLink ? userId : null}
                                    selectedUser={{ id: userId, name: userName }}
                                    comparisonUser={null}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Top 5 Players Section */}
            <div className="mt-16 mx-auto max-w-4xl">
                <h2 className="text-3xl font-semibold text-gray-900">Top 5 Players</h2>
                <ul className="mt-8 space-y-4">
                    {topPlayers.map((player) => (
                        <li
                            key={player.id}
                            className="flex items-center justify-between bg-white shadow-md rounded-lg px-6 py-4"
                        >
                            <span className="text-lg font-medium text-gray-900">{player.name}</span>
                            <span className="text-lg font-semibold text-blue-600">{player.score} pts</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Link to Full Leaderboard */}
            <div className="mt-10 text-center">
                <Link
                    to="/leaderboard"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    View Full Leaderboard
                </Link>
            </div>
        </div>
    );
};

export default Home;
