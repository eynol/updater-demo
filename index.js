#!/usr/bin/env node
const { exec } = require('child_process');

exec('git tag', (error, output, stderr) => {
    if (error) {
        process.exit(0);
    } else {
        console.log(output);
    }
})