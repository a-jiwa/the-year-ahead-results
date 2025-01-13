import React from 'react';
import HorizontalDensityLine from './HorizontalDensityLine';
import MathCalculation from './MathCalculation';
import { getDescriptionText } from './utils';

const Question = ({
                      question,
                      userAnswer,
                      comparisonAnswer,
                      groupAverage,
                      otherUserResponses = [],
                      userName,
                      comparisonUserName,
                      showDescription,
                      showDetails,
                      showOtherUserLines,
                      showMathSection,
                      isAccessedViaSpecialLink, // Indicates if the app was accessed via a special link
                      specialUserId, // The ID of the special link user
                      selectedUser, // The currently selected user (passed as a prop)
                      comparisonUser, // The comparison user (passed as a prop)
                  }) => {
    const positions = {
        user: `${userAnswer}%`,
        comparison: comparisonAnswer !== null ? `${comparisonAnswer}%` : null,
        group: `${groupAverage}%`,
    };

    /**
     * Determines the appropriate description text based on:
     * - Whether the user accessed via a special link.
     * - Whether one or two users are selected.
     * - The combination of the special link user and another selected user.
     */
    const getDescriptionText = () => {
        const selectedUserName = selectedUser?.name?.split(' ')[0] || "User";
        const comparisonUserName = comparisonUser?.name?.split(' ')[0] || "Comparison";
        const outcome = question.occurred ? 100 : 0;

        const userDistanceFromOutcome = Math.abs(userAnswer - outcome);
        const comparisonDistanceFromOutcome = Math.abs(comparisonAnswer - outcome);
        const groupDistanceFromOutcome = Math.abs(groupAverage - outcome);

        const roundToTwoDecimalPlaces = (value) => Math.round(value * 100) / 100;

        const outcomeDescription = question.occurred
            ? "The event did happen."
            : "The event did not happen.";

        // Build base sentences
        const predictionsSentence = comparisonUser
            ? `${selectedUserName} gave this event a ${userAnswer}% likelihood of occurring, while ${comparisonUserName} gave it a ${comparisonAnswer}% likelihood.`
            : `${selectedUserName} gave this event a ${userAnswer}% likelihood of occurring.`;

        let closerToOutcomeSentence = "";
        if (comparisonUser) {
            if (userDistanceFromOutcome < comparisonDistanceFromOutcome) {
                closerToOutcomeSentence = `${selectedUserName} was closer to the outcome than ${comparisonUserName}.`;
            } else if (comparisonDistanceFromOutcome < userDistanceFromOutcome) {
                closerToOutcomeSentence = `${comparisonUserName} was closer to the outcome than ${selectedUserName}.`;
            } else {
                closerToOutcomeSentence = `${selectedUserName} and ${comparisonUserName} were equally close to the outcome.`;
            }
        }

        let comparisonToGroupSentence = "";
        if (comparisonUser) {
            if (
                userDistanceFromOutcome < groupDistanceFromOutcome &&
                comparisonDistanceFromOutcome < groupDistanceFromOutcome
            ) {
                comparisonToGroupSentence = `Both ${selectedUserName} and ${comparisonUserName} were closer to the outcome than the group average of ${roundToTwoDecimalPlaces(groupAverage)}%.`;
            } else if (
                userDistanceFromOutcome >= groupDistanceFromOutcome &&
                comparisonDistanceFromOutcome >= groupDistanceFromOutcome
            ) {
                comparisonToGroupSentence = `Both ${selectedUserName} and ${comparisonUserName} were farther from the outcome than the group average of ${roundToTwoDecimalPlaces(groupAverage)}%.`;
            } else if (userDistanceFromOutcome < groupDistanceFromOutcome) {
                comparisonToGroupSentence = `${selectedUserName} was closer to the outcome than the group average of ${roundToTwoDecimalPlaces(groupAverage)}%, while ${comparisonUserName} was farther.`;
            } else {
                comparisonToGroupSentence = `${comparisonUserName} was closer to the outcome than the group average of ${roundToTwoDecimalPlaces(groupAverage)}%, while ${selectedUserName} was farther.`;
            }
        } else {
            comparisonToGroupSentence = `${selectedUserName} was ${
                userDistanceFromOutcome < groupDistanceFromOutcome
                    ? `${roundToTwoDecimalPlaces(groupDistanceFromOutcome - userDistanceFromOutcome)}% closer`
                    : `${roundToTwoDecimalPlaces(userDistanceFromOutcome - groupDistanceFromOutcome)}% farther`
            } to the outcome than the group average of ${roundToTwoDecimalPlaces(groupAverage)}%.`;
        }

        // Combine sentences for final output
        return `${outcomeDescription} ${predictionsSentence} ${
            closerToOutcomeSentence ? closerToOutcomeSentence : ""
        } ${comparisonToGroupSentence}`;
    };



    const threshold = 5;
    const isWithinThreshold =
        comparisonAnswer !== null && Math.abs(userAnswer - comparisonAnswer) <= threshold;

    const areValuesEqual = userAnswer === comparisonAnswer;
    const equalOffset = 0.5;
    const adjustedUserPosition = areValuesEqual ? `${userAnswer - equalOffset}%` : positions.user;
    const adjustedComparisonPosition = areValuesEqual
        ? `${comparisonAnswer + equalOffset}%`
        : positions.comparison;

    const isUserLeft = areValuesEqual
        ? adjustedUserPosition < adjustedComparisonPosition
        : userAnswer < comparisonAnswer;

    const userTransform = isWithinThreshold
        ? (isUserLeft ? 'translateX(-100%)' : 'translateX(0)')
        : 'translateX(-50%)';
    const comparisonTransform = isWithinThreshold
        ? (isUserLeft ? 'translateX(0)' : 'translateX(-100%)')
        : 'translateX(-50%)';

    // Calculate the Brier Scores
    const outcome = question.occurred === true ? 100 : 0;

    // User's Brier Score
    const userPrediction = userAnswer;
    const userBrierScore = Math.pow((userPrediction / 100) - (outcome / 100), 2);

    // Comparison User's Brier Score
    const comparisonPrediction = comparisonAnswer !== null ? comparisonAnswer : null;
    const comparisonBrierScore = comparisonPrediction !== null
        ? Math.pow((comparisonPrediction / 100) - (outcome / 100), 2)
        : null;

    const hasComparisonUser = comparisonPrediction !== null;

    const descriptionText = getDescriptionText(); // Generate description text (as before)

    const highlightKeywords = (text = "") => {
        // Define patterns for "did not," "did," "was not," and "was"
        const patterns = [
            { word: "did not", className: "bg-red-100 font-bold text-red-600 px-1" },
            { word: "did", className: "bg-green-100 font-bold text-green-600 px-1" },
            { word: "was not", className: "bg-red-100 font-bold text-red-600 px-1" },
            { word: "was", className: "bg-green-100 font-bold text-green-600 px-1" },
        ];

        // Create regex to match patterns in order
        const regex = new RegExp(`(${patterns.map(p => p.word).join("|")})`, "gi");

        // Split the text into parts based on the regex
        const parts = text.split(regex);

        // Map parts to React elements with appropriate styles
        return parts.map((part, index) => {
            const pattern = patterns.find(p => p.word.toLowerCase() === part.toLowerCase());
            if (pattern) {
                return (
                    <span key={index} className={pattern.className}>
                    {part}
                </span>
                );
            }
            return part;
        });
    };




    return (
        <div className="p-6 border rounded-lg shadow-sm bg-white snap-start scroll-mt-52 lg:snap-center">

            {/* Display Title */}
            <h2 className="text-xl sm:text-2xl text-gray-950">
                {highlightKeywords(question.title, ["Election", "Prediction"])}
            </h2>

            {/* Display Original Question Text */}
            <p className="text-m mt-6 text-gray-500 italic">
                {/*<strong>Question: </strong>*/}
                {question.text}
            </p>

            {/* Display Summary */}
            {question.summary && (
                <p className="text-m mt-2 text-gray-500">
                    {question.summary}
                </p>
            )}
            {/* Conditionally Render Description */}
            {showDescription && descriptionText && (
                <p className="text-m mt-2 text-gray-500">{descriptionText}</p>
            )}


            {/* Conditionally Render Details */}
            {/*{showDetails && (*/}
            {/*    <div className="mt-8 flex flex-wrap items-center justify-between text-sm text-gray-600">*/}
            {/*        <div className="flex items-center">*/}
            {/*            <strong className="mr-1">User's Answer:</strong> {userAnswer}%*/}
            {/*        </div>*/}
            {/*        {comparisonAnswer !== null && (*/}
            {/*            <div className="flex items-center">*/}
            {/*                <strong className="mr-1">Comparison Answer:</strong> {comparisonAnswer}%*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*        <div className="flex items-center">*/}
            {/*            <strong className="mr-1">Group Average:</strong> {groupAverage}%*/}
            {/*        </div>*/}
            {/*        <div className="flex items-center">*/}
            {/*            <strong className="mr-1">Outcome:</strong>{' '}*/}
            {/*            {question.occurred === true ? 'Yes' : question.occurred === false ? 'No' : 'Unknown'}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* Chart Section */}
            <div className="relative mt-28 mb-12 mx-5">
                {/* Violin Density Line */}
                {otherUserResponses.length > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            top: '50%', // Aligns the center of the parent
                            transform: 'translateY(-50%)', // Moves violin plot to match vertical center
                            zIndex: 1, // Lower z-index for the violin plot
                        }}
                    >
                        <HorizontalDensityLine responses={otherUserResponses}/>
                    </div>
                )}
                <div className="relative h-0.5 bg-gray-200 w-full">

                    {/* Markers and Labels */}
                    {/* User's Marker */}
                    <div
                        className="absolute -top-12 text-center text-xs text-blue-500"
                        style={{
                            left: `calc(${adjustedUserPosition} + 2px)`, // Shift text 2px to the right
                            transform: userTransform,
                            zIndex: 2, // Higher z-index to appear above the violin plot
                        }}
                    >
                        {userName ? userName.split(' ')[0] : ''}
                    </div>

                    <div
                        className="absolute -top-9 text-center text-xs text-blue-500"
                        style={{
                            left: `calc(${adjustedUserPosition} + 2px)`, // Shift percentage 2px to the right
                            transform: userTransform,
                            zIndex: 2, // Higher z-index
                        }}
                    >
                        {userAnswer}%
                    </div>


                    {/* Comparison User's Marker */}
                    {positions.comparison && (
                        <>
                            <div
                                className="absolute -top-12 text-center text-xs text-orange-500"
                                style={{
                                    left: adjustedComparisonPosition,
                                    transform: comparisonTransform,
                                    zIndex: 2,
                                }}
                            >
                                {comparisonUserName ? comparisonUserName.split(' ')[0] : 'Comparison'}
                            </div>

                            <div
                                className="absolute -top-9 text-center text-xs text-orange-500"
                                style={{
                                    left: adjustedComparisonPosition,
                                    transform: comparisonTransform,
                                    zIndex: 2,
                                }}
                            >
                                {comparisonAnswer}%
                            </div>
                        </>
                    )}

                    {/* Group Average Marker */}
                    <div
                        className="absolute -bottom-10 text-center text-xs text-gray-500"
                        style={{
                            left: positions.group,
                            transform: 'translateX(-50%)',
                            zIndex: 2,
                        }}
                    >
                        {groupAverage}%
                    </div>
                    <div
                        className="absolute top-9 text-center text-xs text-gray-500"
                        style={{
                            left: positions.group,
                            transform: 'translateX(-50%)',
                            zIndex: 2,
                        }}
                    >
                        Average
                    </div>

                    {/* Markers */}
                    <div
                        className="absolute top-[-20px] h-[40px] w-1 bg-blue-500"
                        style={{
                            left: adjustedUserPosition,
                            opacity: 0.9,
                            zIndex: 2,
                        }}
                        title={`User: ${userAnswer}%`}
                    ></div>
                    {positions.comparison && (
                        <div
                            className="absolute top-[-20px] h-[40px] w-1 bg-orange-500"
                            style={{
                                left: adjustedComparisonPosition,
                                opacity: 0.9,
                                zIndex: 2,
                            }}
                            title={`Comparison: ${comparisonAnswer}%`}
                        ></div>
                    )}
                    <div
                        className="absolute top-[-20px] h-[40px] w-0"
                        style={{
                            left: positions.group,
                            borderLeft: '2px dotted black',
                            zIndex: 2,
                        }}
                        title={`Group: ${groupAverage}%`}
                    ></div>
                </div>

                <div className="relative flex justify-between mt-5 text-sm text-gray-600">
                    {/* 0% Label */}
                    <span
                        className={question.occurred === false ? 'bg-red-200 font-bold text-red-600 px-2 rounded' : ''}
                        style={{transform: 'translateX(-50%)'}} // Move 0% to the left
                    >
        0%
    </span>

                    {/* 100% Label */}
                    <span
                        className={question.occurred === true ? 'bg-green-200 font-bold text-green-600 px-2 rounded' : ''}
                        style={{transform: 'translateX(50%)'}} // Move 100% to the right
                    >
        100%
    </span>
                </div>


            </div>


            {/* Math Equation Section */}
            {showMathSection && (
                <div className="mt-8 bg-gray-50 border rounded p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Brier Score Calculation:</h3>
                    <div
                        className={`flex flex-col ${hasComparisonUser ? 'lg:flex-row' : ''} gap-4`}
                    >
                        {/* User's Calculation */}
                        <div className={`${hasComparisonUser ? 'lg:w-1/2' : 'w-full'}`}>
                        <MathCalculation
                                name={userName}
                                prediction={userAnswer}
                                outcome={outcome}
                                color="text-blue-600"
                            />
                        </div>

                        {/* Comparison User's Calculation */}
                        {hasComparisonUser && (
                            <div className="lg:w-1/2">
                                <MathCalculation
                                    name={comparisonUserName || 'Comparison'}
                                    prediction={comparisonAnswer}
                                    outcome={outcome}
                                    color="text-orange-600"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Question;
