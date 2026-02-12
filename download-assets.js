
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const baseUrl = 'https://raw.githubusercontent.com/jona70x/Alphabet-with-sounds/master/sounds/';
const targetDir = path.join(__dirname, 'public', 'assets', 'sounds');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

console.log(`Downloading assets to ${targetDir}...`);

letters.forEach(letter => {
    const filename = `${letter}.mp3`;
    const fileUrl = `${baseUrl}${filename}`;
    const filePath = path.join(targetDir, filename);

    const file = fs.createWriteStream(filePath);
    https.get(fileUrl, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close();
            // console.log(`Downloaded ${filename}`);
        });
    }).on('error', function (err) {
        fs.unlink(filePath, () => { });
        console.error(`Error downloading ${filename}: ${err.message}`);
    });
});
