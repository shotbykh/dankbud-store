const https = require('https');

// Production Endpoint
const HOST = 'api-pudo.co.za';
const PATH = '/api/v1/lockers-data';
const KEY = '51741400|DSOAIQQdumLEKCWH3ydqKv62ybx15kenSkDGjoeQb280ce3f';

const req = https.request({
    hostname: HOST,
    path: PATH,
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log(`Total Terminals: ${json.length}`);
            
            // Search for "Walmer"
            const walmer = json.filter(t => JSON.stringify(t).toLowerCase().includes('walmer'));
            console.log(`Found "Walmer" matches: ${walmer.length}`);
            if (walmer.length > 0) {
                console.log("Sample Match:", JSON.stringify(walmer[0], null, 2));
            } else {
                console.log("First 3 items:", JSON.stringify(json.slice(0, 3), null, 2));
            }
        } catch (e) {
            console.error("Parse Error:", e);
            console.log("Raw Data Start:", data.substring(0, 500));
        }
    });
});

req.on('error', e => console.error(e));
req.end();
