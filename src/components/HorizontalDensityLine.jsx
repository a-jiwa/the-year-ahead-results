import React from 'react';
import * as d3 from 'd3';

const HorizontalDensityLine = ({ responses }) => {
    const width = 1000;
    const height = 40;
    const bandwidth = 5;
    const margin = { top: 10, bottom: 10 };

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);

    const kernelDensityEstimator = (kernel, X) => {
        return X.map(x => [
            x,
            d3.mean(responses, v => kernel(x - v)), // Density value
        ]);
    };

    const kernelEpanechnikov = bandwidth => u =>
        Math.abs(u /= bandwidth) <= 1 ? 0.75 * (1 - u * u) / bandwidth : 0;

    const density = kernelDensityEstimator(
        kernelEpanechnikov(bandwidth),
        xScale.ticks(100)
    );

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(density, d => d[1])])
        .range([0, height / 2]);

    const area = d3.area()
        .x(d => xScale(d[0]))
        .y0(d => height / 2 - yScale(d[1]))
        .y1(d => height / 2 + yScale(d[1]))
        .curve(d3.curveCatmullRom);

    return (
        <svg
            width="100%"
            height={height + margin.top + margin.bottom}
            style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                marginTop: -margin.top,
            }}
        >
            <path
                d={area(density)}
                fill="rgba(211, 211, 211, 0.5)"
            />
        </svg>
    );
};

export default HorizontalDensityLine;
