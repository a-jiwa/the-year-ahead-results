import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

const MathCalculation = ({ name, prediction, outcome, color }) => {
    const brierScore = Math.pow((prediction / 100) - (outcome / 100), 2);

    return (
        <div className="p-4 rounded shadow-sm">
            <h4 className={`text-md mb-2 ${color}`}>{name}'s Calculation</h4>
            <BlockMath math="B = \left(\frac{P}{100} - \frac{O}{100}\right)^2" />
            <p className="text-sm text-gray-600 mt-4">Substituting:</p>
            <BlockMath math={`B = \\left(\\frac{${prediction}}{100} - \\frac{${outcome}}{100}\\right)^2`} />
            <BlockMath math={`B = \\left(${(prediction / 100).toFixed(2)} - ${(outcome / 100).toFixed(2)}\\right)^2`} />
            <BlockMath math={`B = \\left(${((prediction / 100) - (outcome / 100)).toFixed(2)}\\right)^2`} />
            <BlockMath math={`B = ${brierScore.toFixed(4)}`} />
        </div>
    );
};

export default MathCalculation;
