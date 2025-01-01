import * as d3 from 'd3'; // Import d3 for density computations

// Kernel Density Estimator
export const kernelDensityEstimator = (kernel, X, responses) => {
    return X.map(x => [
        x,
        d3.mean(responses, v => kernel(x - v)), // Density value
    ]);
};

// Epanechnikov Kernel
export const kernelEpanechnikov = bandwidth => u =>
    Math.abs(u /= bandwidth) <= 1 ? 0.75 * (1 - u * u) / bandwidth : 0;

// Description Text Utility
export const getDescriptionText = ({
                                       isAccessedViaSpecialLink,
                                       specialUserId,
                                       selectedUser,
                                       comparisonUser,
                                   }) => {
    if (isAccessedViaSpecialLink) {
        if (selectedUser?.id === specialUserId && !comparisonUser) {
            return `You accessed the app via a special link and are viewing your own results, ${selectedUser.name}.`;
        }
        if (selectedUser?.id === specialUserId && comparisonUser?.id) {
            return `You accessed the app via a special link and are comparing your results (${selectedUser.name}) with ${comparisonUser.name}.`;
        }
    }
    if (selectedUser && !comparisonUser) {
        return `${selectedUser.name}'s results are displayed below.`;
    }
    if (selectedUser && comparisonUser) {
        return `Comparing results for ${selectedUser.name} and ${comparisonUser.name}.`;
    }
    return '';
};
