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
import logToLoki from '../logger';
import MySVG from '../assets/svgs/rank.svg'; // Adjust the path as per your project structure
import Svg2 from '../assets/svgs/rank2.svg';
import Svg3 from '../assets/svgs/rank3.svg';
import Svg4 from '../assets/svgs/rank4.svg'; // Fixed duplicate import name

const Home = ({ userId, isAccessedViaSpecialLink }) => {
    const [userName, setUserName] = useState('');
    const [topPlayers, setTopPlayers] = useState([]);
    const [userPosition, setUserPosition] = useState(null);
    const [userScore, setUserScore] = useState(null);
    const [currentSvg, setCurrentSvg] = useState(0);
    const [showRank, setShowRank] = useState(false);
    const [contentVisible, setContentVisible] = useState(false); // State for controlling content visibility

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
        logToLoki({ event: 'HomePageVisited', userId: userId || 'Guest' }, {
            app: 'RESULTS',
            log_type: 'PAGE_VISIT',
            level: 'INFO',
            scraper: 'HomeComponent'
        });

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

    useEffect(() => {
            logToLoki({ event: 'HomePageVisited', userId: userId || 'Guest' }, {
                app: 'RESULTS',
                log_type: 'PAGE_VISIT',
                level: 'INFO',
                scraper: 'HomeComponent'
            });

            if (userId) {
                const user = leaderboardData.find((u) => u.id === userId);
                setUserName(user ? user.name : '');
                setUserScore(user ? user.score : null);

                if (user) {
                    const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.score - a.score);
                    const position = sortedLeaderboard.findIndex((u) => u.id === userId) + 1;
                    setUserPosition(position);
                } else {
                    setUserPosition(null);
                }
            } else {
                setUserName('');
                setUserScore(null);
                setUserPosition(null);
            }

            // Sequence the SVGs
        const timers = [];
        timers.push(setTimeout(() => setCurrentSvg(1), 200));
        timers.push(setTimeout(() => setCurrentSvg(2), 500));
        timers.push(setTimeout(() => setCurrentSvg(3), 600));
        timers.push(setTimeout(() => setShowRank(true), 800));
        timers.push(setTimeout(() => setContentVisible(true), 1000)); // Delay main content

        return () => {
                timers.forEach((timer) => clearTimeout(timer)); // Clear timers when component unmounts
        };
    }, []);

    const renderSvg = () => {
        const commonClasses = "absolute h-40 md:w-32 md:h-32 inset-0"; // Shared size and positioning

        return (
            <div className="relative w-32 h-32"> {/* Fixed size container for stacking */}
                {currentSvg >= 0 && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 73 90"
                        className={`${commonClasses}`}
                    >
                        <image href={MySVG} width="73" height="90" />
                    </svg>
                )}
                {currentSvg >= 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73 90" className={`${commonClasses} animate-expand`}>
                        <image href={Svg2} width="73" height="90" />
                    </svg>
                )}
                {currentSvg >= 2 && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73 90" className={`${commonClasses} animate-fadeIn`}>
                        <image href={Svg3} width="73" height="90" />
                    </svg>
                )}
                {currentSvg >= 3 && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73 90" className={`${commonClasses} animate-pulse`}>
                        <image href={Svg4} width="73" height="90" />
                    </svg>
                )}
                {showRank && userPosition && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73 90" className={`${commonClasses} animate-fadeIn`}>
                        <text
                            x="50%"
                            y="80%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontSize="20"
                            fill="white"
                            fontWeight="bold"
                        >
                            #{userPosition}
                        </text>
                    </svg>
                )}
            </div>
        );
    };

    return (
        <div className="relative isolate px-6 pt-14 lg:px-8">
                {/* SVG Section */}
            <div className="flex justify-center items-center mb-8 h-40 mx-auto max-w-4xl">
                {renderSvg()}
            </div>
            {contentVisible && (
                <>
                    {userName && (
                        <p className="mt-4 text-lg text-gray-800 text-center mx-auto max-w-xl">
                        Hello, <span className="font-semibold">{userName.split(' ')[0]}</span>!
                        You ranked <span className="font-semibold">{getOrdinalSuffix(userPosition)}</span> out of
                        <span className="font-semibold"> {leaderboardData.length} </span> participants.
                        Your final score was <span className="font-semibold">{userScore}</span>.

                        </p>

                )}

                <p className="mt-10 text-lg leading-7 text-gray-600 mx-auto max-w-4xl" >
                    At the start of the year, you joined our competition to predict the likelihood of future events.
                    Your task was to assign probabilities to a series of binary outcomes, testing your ability to
                    forecast
                    accurately and gauge uncertainty. We’ve now compared your predictions to the actual outcomes to
                    evaluate
                    your accuracy using the Brier Score, a measure of how close your forecasts were to reality.
                </p>
                <p className="mt-4 text-lg leading-7 text-gray-600 mx-auto max-w-4xl">
                    The results are in! See how well you did, how you compare to others, and explore the detailed
                    rankings below.
                        </p>

            {/*/!* Best Predictions Section *!/*/}
            {/*{userId && bestQuestionsToShow.length > 0 && (*/}
            {/*    <div className="mt-16 mx-auto max-w-4xl">*/}
            {/*        <h2 className="text-3xl font-semibold text-gray-900">Your Best Predictions</h2>*/}
            {/*        <div className="mt-8 space-y-6">*/}
            {/*            {bestQuestionsToShow.map((question) => {*/}
            {/*                const userAnswer = userAnswers[userId]?.[question.id] || null;*/}
            {/*                const groupAverage = question.groupAverage;*/}
            {/*                const otherUserResponses = allUserResponses[question.id] || [];*/}

            {/*                return (*/}
            {/*                    <Question*/}
            {/*                        key={question.id}*/}
            {/*                        question={question}*/}
            {/*                        userAnswer={userAnswer}*/}
            {/*                        comparisonAnswer={null}*/}
            {/*                        groupAverage={groupAverage}*/}
            {/*                        otherUserResponses={otherUserResponses}*/}
            {/*                        userName={userName || 'You'}*/}
            {/*                        comparisonUserName={null}*/}
            {/*                        showDescription={true}*/}
            {/*                        showDetails={false}*/}
            {/*                        showOtherUserLines={true}*/}
            {/*                        showMathSection={false}*/}
            {/*                        isAccessedViaSpecialLink={isAccessedViaSpecialLink}*/}
            {/*                        specialUserId={isAccessedViaSpecialLink ? userId : null}*/}
            {/*                        selectedUser={{ id: userId, name: userName }}*/}
            {/*                        comparisonUser={null}*/}
            {/*                    />*/}
            {/*                );*/}
            {/*            })}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*        )}*/}

            {/*        /!* Worst Predictions Section *!/*/}
            {/*        {userId && worstQuestionsToShow.length > 0 && (*/}
            {/*            <div className="mt-16 mx-auto max-w-4xl">*/}
            {/*                <h2 className="text-3xl font-semibold text-gray-900">Your Worst Predictions</h2>*/}
            {/*                <div className="mt-8 space-y-6">*/}
            {/*                    {worstQuestionsToShow.map((question) => {*/}
            {/*                        const userAnswer = userAnswers[userId]?.[question.id] || null;*/}
            {/*                        const groupAverage = question.groupAverage;*/}
            {/*                        const otherUserResponses = allUserResponses[question.id] || [];*/}

            {/*                        return (*/}
            {/*                            <Question*/}
            {/*                                key={question.id}*/}
            {/*                                question={question}*/}
            {/*                                userAnswer={userAnswer}*/}
            {/*                                comparisonAnswer={null}*/}
            {/*                                groupAverage={groupAverage}*/}
            {/*                                otherUserResponses={otherUserResponses}*/}
            {/*                                userName={userName || 'You'}*/}
            {/*                                comparisonUserName={null}*/}
            {/*                                showDescription={true}*/}
            {/*                                showDetails={false}*/}
            {/*                                showOtherUserLines={true}*/}
            {/*                                showMathSection={false}*/}
            {/*                                isAccessedViaSpecialLink={isAccessedViaSpecialLink}*/}
            {/*                                specialUserId={isAccessedViaSpecialLink ? userId : null}*/}
            {/*                                selectedUser={{ id: userId, name: userName }}*/}
            {/*                                comparisonUser={null}*/}
            {/*                            />*/}
            {/*                        );*/}
            {/*                    })}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        )}*/}

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
                    <div className="my-10 text-center">
                        <Link
                            to="/leaderboard"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            View Full Leaderboard
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
