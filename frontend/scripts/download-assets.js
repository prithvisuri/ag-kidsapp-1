
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const baseUrl = 'https://raw.githubusercontent.com/jona70x/Alphabet-with-sounds/master/sounds/';
const targetDir = path.join(__dirname, '..', 'public', 'assets', 'sounds');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

console.log(`Downloading assets to ${targetDir}...`);

function downloadFile(letter) {
    const filename = `${letter}.mp3`;
    const fileUrl = `${baseUrl}${filename}`;
    const filePath = path.join(targetDir, filename);

    return new Promise((resolve, reject) => {
        const request = https.get(fileUrl, (response) => {
            if (response.statusCode !== 200) {
                response.resume();
                reject(new Error(`${filename}: unexpected status ${response.statusCode}`));
                return;
            }

            const file = fs.createWriteStream(filePath);
            response.pipe(file);

            file.on('finish', () => {
                file.close(() => resolve(filename));
            });

            file.on('error', (err) => {
                fs.unlink(filePath, () => { });
                reject(new Error(`${filename}: ${err.message}`));
            });
        });

        request.on('error', (err) => {
            fs.unlink(filePath, () => { });
            reject(new Error(`${filename}: ${err.message}`));
        });
    });
}

const results = await Promise.allSettled(letters.map(downloadFile));
const successes = results.filter(result => result.status === 'fulfilled').length;
const failures = results.filter(result => result.status === 'rejected');

failures.forEach((failure) => {
    console.error(`Download error: ${failure.reason.message}`);
});

console.log(`Downloaded ${successes}/${letters.length} sound files.`);

if (failures.length > 0) {
    process.exitCode = 1;
}
