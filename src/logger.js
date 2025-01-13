// src/logger.js
const logToLoki = async (message, level = 'info') => {
    try {
        await fetch('https://logs-prod-012.grafana.net/loki/api/v1/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + btoa('1039188:glc_eyJvIjoiMTI2MzA3OCIsIm4iOiJzdGFjay0xMDgxNDA5LWhsLXJlYWQtZmlyc3QiLCJrIjoieThDMUc2MTExM3U1Z0k2OFh4UE50RXpPIiwibSI6eyJyIjoicHJvZC1ldS13ZXN0LTIifX0='), // Replace YOUR_API_TOKEN
            },
            body: JSON.stringify({
                streams: [
                    {
                        stream: { level },
                        values: [[`${Date.now()}000000`, message]],
                    },
                ],
            }),
        });
    } catch (error) {
        console.error('Failed to send log to Loki:', error);
    }
};

export default logToLoki;
