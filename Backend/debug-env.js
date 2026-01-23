import fs from 'fs';
try {
    const content = fs.readFileSync('.env', 'utf8');
    // Replace values with stars, keeping keys
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        const parts = line.split('=');
        if (parts.length > 1) {
            console.log(`${i + 1}: ${parts[0]}=${'*'.repeat(5)}`);
        } else {
            console.log(`${i + 1}: ${line}`); // Comments or empty lines
        }
    });
} catch (e) {
    console.error(e);
}
