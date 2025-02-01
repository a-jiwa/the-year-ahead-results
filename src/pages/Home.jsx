import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    // Main data
    leaderboardData,

    // Category-specific data
    leaderboardDataUKPolitics,
    leaderboardDataGeopolitics,
    leaderboardDataPopularCulture,
    leaderboardDataCelebrityDeaths,
    leaderboardDataBusiness,
    leaderboardDataSport,

    // Misc
    questions,
    userAnswers,
    allUserResponses,
    userBestPredictionsMap,
    userWorstPredictionsMap,
} from '../data/data';

import Question from '../components/Question';
import logToLoki from '../logger';

// Rank animation images
import MySVG from '../assets/svgs/rank.svg';
import Svg2 from '../assets/svgs/rank2.svg';
import Svg3 from '../assets/svgs/rank3.svg';
import Svg4 from '../assets/svgs/rank4.svg';

// Medal icons
import GoldIcon from '../assets/svgs/gold.svg';
import SilverIcon from '../assets/svgs/silver.svg';
import BronzeIcon from '../assets/svgs/bronze.svg';

//
// Define categories for the entire app
//
const categories = {
    ALL: 'All',
    UK_POLITICS: 'UK Politics',
    GEOPOLITICS: 'Geopolitics',
    POPULAR_CULTURE: 'Popular Culture',
    CELEBRITY_DEATHS: 'Celebrity Deaths',
    BUSINESS: 'Business',
    SPORT: 'Sport',
};

//
// Function to retrieve the correct leaderboard array for each category
//
function getLeaderboardDataForCategory(category) {
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
            // 'All' or unknown
            return leaderboardData;
    }
}

//
// Calculate ranks in descending order of score.
// Ties share the same rank.
//
function calculateRanks(data) {
    let rank = 1;
    return data.map((user, index, array) => {
        // If same score as previous, share rank
        if (index > 0 && user.score === array[index - 1].score) {
            user.rank = array[index - 1].rank;
        } else {
            user.rank = rank;
        }
        rank++;
        return user;
    });
}

const Home = ({ userId, isAccessedViaSpecialLink }) => {
    // Basic user info
    const [userName, setUserName] = useState('');
    const [userPosition, setUserPosition] = useState(null);
    const [userScore, setUserScore] = useState(null);

    // Best Category logic
    const [bestCategory, setBestCategory] = useState(null);
    const [bestCategoryRank, setBestCategoryRank] = useState(null);

    // SVG animation states
    const [currentSvg, setCurrentSvg] = useState(0);
    const [showRank, setShowRank] = useState(false);

    // "Greeting" and "Main Content" visibility states
    const [showGreeting, setShowGreeting] = useState(false);
    const [showMainContent, setShowMainContent] = useState(false);

    // Top 5 players
    const [topPlayers, setTopPlayers] = useState([]);

    //
    // Build arrays of "best" and "worst" questions for the user, if userId is set
    //
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

    //
    // Append correct suffix to numeric rank (1 -> 1st, 2 -> 2nd, etc.)
    //
    const getOrdinalSuffix = (rank) => {
        if (!rank) return '';
        const remainder = rank % 10;
        const tens = Math.floor(rank / 10) % 10;

        if (tens === 1) return `${rank}th`; // e.g. 11th, 12th, 13th
        if (remainder === 1) return `${rank}st`;
        if (remainder === 2) return `${rank}nd`;
        if (remainder === 3) return `${rank}rd`;
        return `${rank}th`;
    };

    //
    // Medal or numeric rank for top 3
    //
    const renderPositionIconLarge = (rank) => {
        switch (rank) {
            case 1:
                return <img src={GoldIcon} alt="Gold" className="w-8 h-8 inline-block" />;
            case 2:
                return <img src={SilverIcon} alt="Silver" className="w-8 h-8 inline-block" />;
            case 3:
                return <img src={BronzeIcon} alt="Bronze" className="w-8 h-8 inline-block" />;
            default:
                return <span className="text-lg font-bold">{rank}</span>;
        }
    };

    //
    // On component mount or whenever userId changes, fetch the user's overall rank & top 5
    //
    useEffect(() => {
        logToLoki({ event: 'HomePageVisited', userId: userId || 'Guest' }, {
            app: 'RESULTS',
            log_type: 'PAGE_VISIT',
            level: 'INFO',
            scraper: 'HomeComponent'
        });

        if (userId) {
            // 1. Find user in "All" data
            const user = leaderboardData.find((u) => u.id === userId);
            setUserName(user ? user.name : '');
            setUserScore(user ? user.score : null);

            // 2. If found, figure out overall rank in "All" category
            if (user) {
                const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.score - a.score);
                const position = sortedLeaderboard.findIndex((u) => u.id === userId) + 1;
                setUserPosition(position);
            } else {
                setUserPosition(null);
            }
        } else {
            // If no userId, reset fields
            setUserName('');
            setUserScore(null);
            setUserPosition(null);
        }

        // Fetch top 5 from the main leaderboard
        const fetchTopPlayers = () => {
            const topPlayersSorted = [...leaderboardData]
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);
            setTopPlayers(topPlayersSorted);
        };
        fetchTopPlayers();
    }, [userId]);

    //
    // Another effect for animations and also computing "best category" if userId is present
    //
    useEffect(() => {
        logToLoki({ event: 'HomePageVisited', userId: userId || 'Guest' }, {
            app: 'RESULTS',
            log_type: 'PAGE_VISIT',
            level: 'INFO',
            scraper: 'HomeComponent'
        });

        // Re-check user data if needed
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

            // Calculate the user's best category
            let bestCat = null;
            let bestCatRank = Infinity;

            // Check rank in each category
            Object.values(categories).forEach((cat) => {
                const dataForCategory = getLeaderboardDataForCategory(cat);
                const ranked = calculateRanks([...dataForCategory].sort((a, b) => b.score - a.score));

                const userInCat = ranked.find((r) => r.id === userId);
                if (userInCat && userInCat.rank < bestCatRank) {
                    bestCatRank = userInCat.rank;
                    bestCat = cat;
                }
            });

            setBestCategory(bestCat || null);
            setBestCategoryRank(bestCatRank === Infinity ? null : bestCatRank);
        } else {
            setBestCategory(null);
            setBestCategoryRank(null);
        }

        // Sequence the SVG animations
        const timers = [];

        // Sequence the SVGs
        timers.push(setTimeout(() => setCurrentSvg(1), 200));
        timers.push(setTimeout(() => setCurrentSvg(2), 500));
        timers.push(setTimeout(() => setCurrentSvg(3), 600));
        timers.push(setTimeout(() => setShowRank(true), 800));

        // Show greeting about 1 second in:
        timers.push(setTimeout(() => setShowGreeting(true), 1000));

        // Delay the rest of the page content further (e.g., 3 seconds):
        timers.push(setTimeout(() => setShowMainContent(true), 3000));

        return () => {
            timers.forEach((t) => clearTimeout(t));
        };
    }, [userId]);

    //
    // Renders the layered SVG animations and final rank overlay
    //
    const renderSvg = () => {
        const commonClasses = 'absolute h-40 md:w-32 md:h-32 inset-0'; // shared positioning

        return (
            <div className="relative w-32 h-32">
                {currentSvg >= 0 && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 73 90"
                        className={commonClasses}
                    >
                        <image href={MySVG} width="73" height="90" />
                    </svg>
                )}
                {currentSvg >= 1 && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 73 90"
                        className={`${commonClasses} animate-expand`}
                    >
                        <image href={Svg2} width="73" height="90" />
                    </svg>
                )}
                {currentSvg >= 2 && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 73 90"
                        className={`${commonClasses} animate-fadeIn`}
                    >
                        <image href={Svg3} width="73" height="90" />
                    </svg>
                )}
                {currentSvg >= 3 && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 73 90"
                        className={`${commonClasses} animate-pulse`}
                    >
                        <image href={Svg4} width="73" height="90" />
                    </svg>
                )}
                {showRank && userPosition && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 73 90"
                        className={`${commonClasses} animate-fadeIn`}
                    >
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

    //
    // Render the page with fade-in sections
    //
    return (
        <div className="relative isolate px-6 pt-14 lg:px-8">
            {/* SVG Section */}
            <div className="flex justify-center items-center mb-8 h-40 mx-auto max-w-4xl">
                {renderSvg()}
            </div>

            {/* -- Greeting Section with fade-in -- */}
            <div
                className={`
                    transition-opacity 
                    duration-700
                    ${showGreeting ? 'opacity-100' : 'opacity-0'}
                `}
            >
                {userName && (
                    <p className="mt-4 text-lg text-gray-800 text-center mx-auto max-w-xl">
                        Hello, <span className="font-semibold">{userName.split(' ')[0]}</span>!
                        You ranked <span className="font-semibold">{getOrdinalSuffix(userPosition)}</span> out of
                        <span className="font-semibold"> {leaderboardData.length} </span> participants.
                        Your final score was <span className="font-semibold">{userScore}</span>.
                    </p>
                )}

                {bestCategory && bestCategoryRank && (
                    <p className="mt-4 text-lg text-gray-800 text-center mx-auto max-w-xl">
                        Your best category was <span className="font-semibold">{bestCategory}</span>,
                        where you ranked{' '}
                        <span className="font-semibold">{getOrdinalSuffix(bestCategoryRank)}</span>.
                    </p>
                )}
            </div>

            {/* -- Main Content Section with a later fade-in -- */}
            <div
                className={`
                    transition-opacity 
                    duration-700
                    ${showMainContent ? 'opacity-100' : 'opacity-0'}
                `}
            >
                <p className="mt-10 text-lg leading-7 text-gray-600 mx-auto max-w-4xl">
                    At the start of the year, you joined our competition to predict the likelihood of future events.
                    Your task was to assign probabilities to a series of binary outcomes, testing your ability to
                    forecast accurately and gauge uncertainty. We’ve now compared your predictions to the actual
                    outcomes to evaluate your accuracy using the Brier Score, a measure of how close your forecasts
                    were to reality.
                </p>
                <p className="mt-4 text-lg leading-7 text-gray-600 mx-auto max-w-4xl">
                    The results are in! See how well you did, how you compare to others, and explore the detailed
                    rankings below.
                </p>

                <div className="text-center mt-8">
                    <Link
                        to={userId ? `/user/${userId}/full-results` : "/full-results"}
                        className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm
                            hover:bg-blue-500 focus-visible:outline focus-visible:outline-2
                            focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        View Your Full Results
                    </Link>
                </div>

                {/* (Optionally show Best/Worst Predictions sections here) */}

                {/* Top 5 Players Section */}
                <div className="mt-16 mx-auto max-w-4xl">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">Top 5 Players</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                            <tr>
                                <th className="px-6 py-4 text-center text-lg font-bold text-gray-700 border-b border-gray-300">
                                    Rank
                                </th>
                                <th className="px-6 py-4 text-left text-lg font-bold text-gray-700 border-b border-gray-300">
                                    User
                                </th>
                                <th className="px-6 py-4 text-right text-lg font-bold text-gray-700 border-b border-gray-300">
                                    Score
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {topPlayers.map((player, idx) => {
                                const rank = idx + 1; // index is 0-based
                                return (
                                    <tr
                                        key={player.id}
                                        className="border-b border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-center">
                                            {renderPositionIconLarge(rank)}
                                        </td>
                                        <td className="px-6 py-4 text-lg font-semibold text-gray-800">
                                            {player.name}
                                        </td>
                                        <td className="px-6 py-4 text-lg font-semibold text-gray-900 text-right">
                                            {player.score} pts
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Link to Full Leaderboard */}
                <div className="my-10 text-center">
                    <Link
                        to={userId ? `/user/${userId}/leaderboard` : "/leaderboard"}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm
                            hover:bg-blue-500 focus-visible:outline focus-visible:outline-2
                            focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        View Full Leaderboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
