#!/usr/bin/env node

/**
 * Monitoring Script
 * 
 * This script can be run manually or via cron to check all passwords for breaches.
 * 
 * Usage:
 *   node scripts/monitor.js
 * 
 * Or set up a cron job:
 *   0 2 * * * cd /path/to/passwordgenerator && node scripts/monitor.js
 */

const https = require('https');
const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:3000';

function runMonitoring() {
  const url = new URL(`${API_URL}/api/monitor`);
  const protocol = url.protocol === 'https:' ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'POST',
  };

  const req = protocol.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('Monitoring completed:', result.message);
        if (result.results) {
          console.log(`Checked: ${result.results.checked}, Breached: ${result.results.breached}, Errors: ${result.results.errors}`);
        }
        process.exit(0);
      } catch (error) {
        console.error('Error parsing response:', error);
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error running monitoring:', error.message);
    process.exit(1);
  });

  req.end();
}

console.log('Starting password breach monitoring...');
runMonitoring();

