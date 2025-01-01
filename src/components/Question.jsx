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
        const { name: selectedUserName } = selectedUser || {}; // Extract the selected user's name
        const { name: comparisonUserName } = comparisonUser || {}; // Extract the comparison user's name

        const outcomeValue = question.occurred ? 100 : 0; // Outcome is 100% if the event occurred, 0% if it didn’t
        const outcomeDescription = question.occurred
            ? "the event happened."
            : "the event did not happen."; // Natural language description of whether the event occurred

        // Calculate how far each prediction was from the actual outcome
        const userDistanceFromOutcome = Math.abs(userAnswer - outcomeValue);
        const comparisonDistanceFromOutcome = comparisonAnswer !== null
            ? Math.abs(comparisonAnswer - outcomeValue)
            : null;
        const groupDistanceFromOutcome = Math.abs(groupAverage - outcomeValue);

        // Determine whether the user's prediction was closer to the actual outcome than the comparison user's
        const userCloserToOutcome =
            comparisonAnswer !== null
                ? userDistanceFromOutcome < comparisonDistanceFromOutcome
                : null;

        // Determine whether the user's prediction was closer to the outcome than the group average
        const userCloserToGroup = userDistanceFromOutcome < groupDistanceFromOutcome;

        // Determine whether the comparison user's prediction was closer to the outcome than the group average
        const comparisonCloserToGroup =
            comparisonAnswer !== null
                ? comparisonDistanceFromOutcome < groupDistanceFromOutcome
                : null;

        /**
         * CASE 1: Special link, single user (no comparison)
         * When the user accessed the app through a special link and is viewing only their own results.
         * - Explains the event outcome.
         * - States the user's prediction and how far off it was.
         * - Compares the user's prediction to the group average.
         */
        if (isAccessedViaSpecialLink) {
            if (selectedUser?.id === specialUserId && !comparisonUser) {
                return `You accessed this page through a special link, ${selectedUserName}. ${
                    question.occurred
                        ? "The event occurred as expected."
                        : "The event did not occur."
                } Your prediction was ${userAnswer}%, which ${
                    userDistanceFromOutcome === 0
                        ? "was spot on!"
                        : `was off by ${userDistanceFromOutcome} percentage points.`
                } The group's average prediction was ${groupAverage}%, ${
                    userCloserToGroup
                        ? "but your prediction was closer to the actual outcome."
                        : "and the group's prediction was closer to what happened."
                }`;
            }

            /**
             * CASE 2: Special link, user comparing with another user
             * When the user accessed the app via a special link and is comparing their prediction with another user's.
             * - Explains the event outcome.
             * - States both the user's and the comparison user's predictions.
             * - Explains who made a prediction closer to the actual outcome.
             * - Compares the user's prediction to the group average.
             */
            if (selectedUser?.id === specialUserId && comparisonUser?.id) {
                return `You’re comparing your results (${userAnswer}%) with ${comparisonUserName} (${comparisonAnswer}%). ${
                    question.occurred
                        ? "The event happened as predicted."
                        : "The event didn’t happen."
                } ${
                    userCloserToOutcome
                        ? `Your prediction was closer to the actual outcome (${outcomeValue}%) than ${comparisonUserName}'s prediction.`
                        : `${comparisonUserName}'s prediction was closer to the actual outcome than yours.`
                } Compared to the group average of ${groupAverage}%, ${
                    userCloserToGroup
                        ? "your prediction was more accurate."
                        : "the group's prediction was closer to what happened."
                }`;
            }
        }

        /**
         * CASE 3: Single user (no comparison, no special link)
         * When a single user's prediction is being viewed without any comparison or special link.
         * - Explains the event outcome.
         * - States the user's prediction and how far off it was.
         * - Compares the user's prediction to the group average.
         */
        if (selectedUser && !comparisonUser) {
            return `Here’s how ${selectedUserName}'s prediction stacks up: ${
                question.occurred
                    ? "The event did happen."
                    : "The event did not happen."
            } ${selectedUserName} predicted ${userAnswer}%, ${
                userDistanceFromOutcome === 0
                    ? "which was exactly right!"
                    : `which was off by ${userDistanceFromOutcome} percentage points.`
            } The group average prediction was ${groupAverage}%, ${
                userCloserToGroup
                    ? "but ${selectedUserName}'s prediction was closer to the actual outcome."
                    : "and the group’s prediction was closer to what actually happened."
            }`;
        }

        /**
         * CASE 4: Two users compared
         * When two users' predictions are being compared.
         * - Explains the event outcome.
         * - States both users' predictions.
         * - Explains who made a prediction closer to the actual outcome.
         * - Compares the selected user's prediction to the group average.
         */
        if (selectedUser && comparisonUser) {
            return `We’re comparing predictions from ${selectedUserName} and ${comparisonUserName}: ${
                question.occurred
                    ? "The event happened."
                    : "The event didn’t happen."
            } ${selectedUserName} predicted ${userAnswer}%, while ${comparisonUserName} predicted ${comparisonAnswer}%. ${
                userCloserToOutcome
                    ? `Overall, ${selectedUserName}'s prediction was closer to the actual outcome (${outcomeValue}%).`
                    : `${comparisonUserName}'s prediction was closer to the actual outcome (${outcomeValue}%).`
            } ${
                userCloserToGroup
                    ? `${selectedUserName}'s prediction was also closer to the outcome compared to the group average of ${groupAverage}%.`
                    : `${selectedUserName}'s prediction was further from the outcome compared to the group average of ${groupAverage}%.`
            }`;
        }

        /**
         * CASE 5: Default case (no specific user or comparison)
         * When no specific user or comparison is selected.
         * - Explains the event outcome.
         * - Compares the group's average prediction to the actual outcome.
         */
        return `Here’s a summary of the predictions: ${
            question.occurred
                ? "The event happened."
                : "The event didn’t happen."
        } The group average prediction was ${groupAverage}%, ${
            userDistanceFromOutcome < groupDistanceFromOutcome
                ? "and the selected user’s prediction was closer to the outcome."
                : "but the group average prediction was closer to the outcome."
        }`;
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

    // Calculate how close the user's prediction is to the outcome
    const error = Math.abs(userAnswer - outcome); // Absolute error between prediction and outcome
    const normalizedError = error / 100; // Normalize error to a 0-1 scale

// Helper function to convert HEX to RGB
    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    };

// Define colors as HEX constants
    const GREEN_HEX = "#27ae60"; // Green
    const RED_HEX = "#E64800";   // Red
    const WHITE_HEX = "#FFFFFF"; // White

    const interpolateColor = (value, opacity = 1, boxShadowOpacity = 0.5) => {
        const green = hexToRgb(GREEN_HEX); // Convert green HEX to RGB
        const red = hexToRgb(RED_HEX);     // Convert red HEX to RGB
        const white = hexToRgb(WHITE_HEX); // Convert white HEX to RGB

        const interpolate = (color1, color2, t) => ({
            r: Math.round(color1.r + t * (color2.r - color1.r)),
            g: Math.round(color1.g + t * (color2.g - color1.g)),
            b: Math.round(color1.b + t * (color2.b - color1.b)),
        });

        // Calculate box-shadow color by interpolating
        let shadowColor;
        if (value === 0) {
            shadowColor = green;
        } else if (value <= 0.5) {
            const t = value * 2; // Normalize to [0, 1]
            shadowColor = interpolate(white, green, t);
        } else {
            const t = (value - 0.5) * 2; // Normalize to [0, 1]
            shadowColor = interpolate(red, white, t);
        }

        return {
            borderColor: value < 0.5 ? `rgba(${green.r}, ${green.g}, ${green.b}, ${opacity})` : `rgba(${red.r}, ${red.g}, ${red.b}, ${opacity})`,
            boxShadowColor: `rgba(${shadowColor.r}, ${shadowColor.g}, ${shadowColor.b}, ${boxShadowOpacity})`,
        };
    };



    const colors = interpolateColor(normalizedError, 1, 0.2); // Set opacity 1 for border and 0.3 for box shadow

    const descriptionText = getDescriptionText(); // Generate description text (as before)

    return (
        <div
            className="p-6 border-2 rounded-lg shadow-sm"
            style={{
                borderColor: colors.borderColor, // Dynamic border color
                boxShadow: `inset 0 0 15px 7px ${colors.boxShadowColor}`, // Inner glow effect with reduced opacity
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease', // Smooth transition
            }}
        >
            <p className="text-2xl text-gray-900">{question.text}</p>

            {/* Conditionally Render Description */}
            {showDescription && descriptionText && (
                <p className="text-m mt-4 text-gray-500">{descriptionText}</p>
            )}

            {/* Conditionally Render Details */}
            {showDetails && (
                <div className="mt-8 flex flex-wrap items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                        <strong className="mr-1">User's Answer:</strong> {userAnswer}%
                    </div>
                    {comparisonAnswer !== null && (
                        <div className="flex items-center">
                            <strong className="mr-1">Comparison Answer:</strong> {comparisonAnswer}%
                        </div>
                    )}
                    <div className="flex items-center">
                        <strong className="mr-1">Group Average:</strong> {groupAverage}%
                    </div>
                    <div className="flex items-center">
                        <strong className="mr-1">Outcome:</strong>{' '}
                        {question.occurred === true ? 'Yes' : question.occurred === false ? 'No' : 'Unknown'}
                    </div>
                </div>
            )}

            {/* Chart Section */}
            <div className="relative mt-28 mb-12">
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
                                {comparisonUserName || 'Comparison'}
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

                {/* Labels */}
                <div className="flex justify-between mt-5 text-sm text-gray-600">
                    <span className={question.occurred === false ? 'font-bold underline' : ''}>0%</span>
                    <span className={question.occurred === true ? 'font-bold underline' : ''}>100%</span>
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
