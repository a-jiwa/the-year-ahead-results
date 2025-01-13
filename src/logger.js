// src/logger.js
const LOKI_URL = 'https://logs-prod-012.grafana.net/loki/api/v1/push';
const USER = '1039188';
const PASSWORD = 'glc_eyJvIjoiMTI2MzA3OCIsIm4iOiJzdGFjay0xMDgxNDA5LWhsLXJlYWQtZmlyc3QiLCJrIjoieThDMUc2MTExM3U1Z0k2OFh4UE50RXpPIiwibSI6eyJyIjoicHJvZC1ldS13ZXN0LTIifX0=';

const logToLoki = async (
    message,
    { app = 'RESULTS', log_type = 'GENERAL', level = 'INFO', scraper = 'Generic Scraper' } = {}
) => {
    // Construct the payload to match Loki's expected format
    const timestamp = (Date.now() * 1000000).toString();
    const logEntry = {
        streams: [
            {
                stream: {
                    app,
                    type: log_type,
                    level,
                    scraper,
                },
                values: [[timestamp.toString(), JSON.stringify(message)]],
            },
        ],
    };

    try {
        const response = await fetch(LOKI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Set up Basic Auth using btoa to base64-encode the credentials
                Authorization: 'Basic ' + btoa(`${USER}:${PASSWORD}`),
            },
            body: JSON.stringify(logEntry),
        });

        if (!response.ok) {
            console.error(`Failed to log to Grafana Loki: ${response.status} - ${await response.text()}`);
        }
    } catch (error) {
        console.error('Request to Loki failed:', error);
    }
};

export default logToLoki;
