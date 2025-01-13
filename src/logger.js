const logToLoki = async (message, level = 'info') => {
    // Split the token into parts
    const tokenPart1 = '1039188';
    const tokenPart2 = 'glc_eyJvIjoiMTI2MzA3OCIsIm4iOiJzdGFjay0xMDgxNDA5LWhsLXJlYWQtZmlyc3QiLCJrIjoieThDMUc2MTExM3U1Z0k2OFh4UE50RXpPIiwibSI6eyJyIjoicHJvZC1ldS13ZXN0LTIifX0=';

    try {
        // Combine the token parts to construct the Authorization header
        await fetch('https://logs-prod-012.grafana.net/loki/api/v1/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + btoa(`${tokenPart1}:${tokenPart2}`),
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
