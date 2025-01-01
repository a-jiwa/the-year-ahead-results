import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { users, questions, userAnswers, allUserResponses } from '../data/data';
import Dropdown from '../components/Dropdown';
import Question from '../components/Question';

const categories = {
    ALL: 'All',
    UK_POLITICS: 'UK Politics',
    GEOPOLITICS: 'Geopolitics',
    POPULAR_CULTURE: 'Popular Culture',
    CELEBRITY_DEATHS: 'Celebrity Deaths',
    BUSINESS: 'Business',
    SPORT: 'Sport',
};

const categoryList = Object.values(categories);

const FullResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { userId } = useParams();

    // State to track selected users
    const [selectedUser, setSelectedUser] = useState(null);
    const [comparisonUser, setComparisonUser] = useState(null);

    // Other state variables
    const [showDescriptions, setShowDescriptions] = useState(true);
    const [showDetails, setShowDetails] = useState(true);
    const [showOtherUserLines, setShowOtherUserLines] = useState(true);
    const [showMathSection, setShowMathSection] = useState(false); // Set to false by default
    const [activeCategory, setActiveCategory] = useState(categories.ALL);


    // State to track if the page was accessed via a special link
    const [isAccessedViaSpecialLink, setIsAccessedViaSpecialLink] = useState(false);

    useEffect(() => {
        // Check if accessed with a userId in the URL
        if (userId) {
            const user = users.find((u) => u.id === userId); // Updated
            if (user) {
                setSelectedUser((prev) => prev || user); // Default only if no prior selection
                setIsAccessedViaSpecialLink(true);
            }
        }

        // Sync query params with dropdowns
        const primaryUserId = searchParams.get('primaryUser');
        const comparisonUserId = searchParams.get('comparisonUser');

        if (primaryUserId) {
            const user = users.find((u) => u.id === primaryUserId); // Updated
            setSelectedUser(user);
        }
        if (comparisonUserId) {
            const user = users.find((u) => u.id === comparisonUserId); // Updated
            setComparisonUser(user);
        }
    }, [userId, searchParams]);

    useEffect(() => {
        // Update query parameters when dropdowns change
        const params = {};
        if (selectedUser) params.primaryUser = selectedUser.id;
        if (comparisonUser) params.comparisonUser = comparisonUser.id;
        setSearchParams(params);
    }, [selectedUser, comparisonUser, setSearchParams]);

    const filteredQuestions = questions.filter((question) => {
        if (activeCategory === categories.ALL) return true;
        return question.category === activeCategory;
    });

    const currentIndex = categoryList.indexOf(activeCategory);
    const previousCategory = currentIndex > 0 ? categoryList[currentIndex - 1] : null;
    const nextCategory = currentIndex < categoryList.length - 1 ? categoryList[currentIndex + 1] : null;

    const handleNext = () => {
        const currentIndex = categoryList.indexOf(activeCategory);
        if (currentIndex < categoryList.length - 1) {
            setActiveCategory(categoryList[currentIndex + 1]);
        }
    };

    const handlePrevious = () => {
        const currentIndex = categoryList.indexOf(activeCategory);
        if (currentIndex > 0) {
            setActiveCategory(categoryList[currentIndex - 1]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-0">
            {/* Conditionally style the title */}
            {/*<h1*/}
            {/*    className={`text-5xl font-bold text-left mb-2 ${*/}
            {/*        isAccessedViaSpecialLink ? 'text-red-600' : 'text-gray-900'*/}
            {/*    }`}*/}
            {/*>*/}
            {/*    Full Results*/}
            {/*</h1>*/}
            {/*<p className="text-left text-gray-600 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>*/}

            {/* Dropdown Section */}
            <div className="sticky top-16 z-10 bg-white/70 backdrop-blur-lg border-b flex gap-8 p-4 py-5">
                <Dropdown
                    label="Select a Primary User"
                    selected={selectedUser}
                    setSelected={setSelectedUser}
                    options={users}
                    excludeId={comparisonUser?.id ?? null}
                    dropdownWidthClasses="sm:w-full w-[70vw]"
                    openLeft={false}
                    circleColor="bg-blue-500"
                    specialUserId={isAccessedViaSpecialLink ? parseInt(userId) : null} // Pass specialUserId if accessed via special link

                />
                <Dropdown
                    label="Select a User to Compare"
                    selected={comparisonUser}
                    setSelected={setComparisonUser}
                    options={[{id: null, name: 'No Comparison'}, ...users]}
                    excludeId={selectedUser?.id ?? null}
                    dropdownWidthClasses="sm:w-full w-[70vw]"
                    openLeft={true}
                    circleColor="bg-orange-500"
                    specialUserId={isAccessedViaSpecialLink ? parseInt(userId) : null} // Pass specialUserId if accessed via special link
                />
            </div>

            {/* Toggle Section */}
            <div className="flex flex-wrap items-center justify-between my-8 px-4 gap-4">
                {/* Description Toggle */}
                <label className="inline-flex items-center cursor-pointer w-[200px]">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={showDescriptions}
                        onChange={() => setShowDescriptions(!showDescriptions)}
                    />
                    <div
                        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span
                        className={`ms-3 text-sm font-medium ${
                            showDescriptions ? 'text-blue-600' : 'text-gray-400'
                        }`}
                    >
                        Descriptions
                    </span>
                </label>

                {/* Details Toggle */}
                <label className="inline-flex items-center cursor-pointer w-[200px]">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={showDetails}
                        onChange={() => setShowDetails(!showDetails)}
                    />
                    <div
                        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span
                        className={`ms-3 text-sm font-medium ${
                            showDetails ? 'text-blue-600' : 'text-gray-400'
                        }`}
                    >
                        Details
                    </span>
                </label>

                {/* Other Users Lines Toggle */}
                <label className="inline-flex items-center cursor-pointer w-[200px]">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={showOtherUserLines}
                        onChange={() => setShowOtherUserLines(!showOtherUserLines)}
                    />
                    <div
                        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span
                        className={`ms-3 text-sm font-medium ${
                            showOtherUserLines ? 'text-blue-600' : 'text-gray-400'
                        }`}
                    >
                        Other Users Lines
                    </span>
                </label>

                {/* Math Section Toggle */}
                <label className="inline-flex items-center cursor-pointer w-[200px]">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={showMathSection}
                        onChange={() => setShowMathSection(!showMathSection)}
                    />
                    <div
                        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600">
                        {/* Moving Element */}
                        <div
                            className={`absolute top-[2px] left-[2px] h-5 w-5 rounded-full flex items-center justify-center bg-white border border-gray-300 dark:border-gray-600 transition-transform duration-200 ${
                                showMathSection ? 'translate-x-[20px]' : 'translate-x-0'
                            }`}
                        >
                            {showMathSection ? (
                                <span
                                    style={{
                                        fontSize: '16px', // Increase emoji size slightly
                                        position: 'relative',
                                        top: '1px', // Push emoji slightly down
                                    }}
                                >
                                🤓
                            </span>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <span
                        className={`ms-3 text-sm font-medium ${
                            showMathSection ? 'text-blue-600' : 'text-gray-400'
                        }`}
                    >
                    Math Section
                </span>
                </label>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b mt-4 mb-6">
                {categoryList.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 text-sm font-medium ${
                            activeCategory === category
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Questions List */}
            {selectedUser ? (
                <div className="mt-8 mx-5">
                    {/*<h2 className="text-2xl font-semibold text-gray-800 mb-6">Questions</h2>*/}
                    <div className="space-y-4">
                        {filteredQuestions.map((question) => (
                            <Question
                                key={question.id}
                                question={question}
                                userAnswer={userAnswers[selectedUser.id]?.[question.id]} // No change needed; `selectedUser.id` is now a string
                                comparisonAnswer={
                                    comparisonUser?.id
                                        ? userAnswers[comparisonUser.id]?.[question.id]
                                        : null
                                }
                                groupAverage={question.groupAverage}
                                otherUserResponses={allUserResponses[question.id] || []}
                                userName={selectedUser.name}
                                comparisonUserName={comparisonUser?.name}
                                showDescription={showDescriptions}
                                showDetails={showDetails}
                                showOtherUserLines={showOtherUserLines}
                                showMathSection={showMathSection}
                                isAccessedViaSpecialLink={isAccessedViaSpecialLink} // Pass special link status
                                specialUserId={isAccessedViaSpecialLink ? userId : null} // Pass special link user ID as a string
                                selectedUser={selectedUser} // Pass selected user as prop
                                comparisonUser={comparisonUser} // Pass comparison user as prop
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    {activeCategory !== categories.ALL && (
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={handlePrevious}
                                disabled={!previousCategory}
                                className={`px-4 py-2 rounded-lg font-semibold ${
                                    !previousCategory
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                {previousCategory ? `Previous: ${previousCategory}` : 'Previous'}
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!nextCategory}
                                className={`px-4 py-2 rounded-lg font-semibold ${
                                    !nextCategory
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                {nextCategory ? `Next: ${nextCategory}` : 'Next'}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-lg text-gray-700 mt-8">Please select a user to view their results.</p>
            )}
        </div>
    );
};

export default FullResults;
