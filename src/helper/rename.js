import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folderPath = path.join(__dirname, '..', '..', 'public');
let counter = 103;

console.log('Mulai proses ganti nama file...');

fs.readdir(folderPath, (err, files) => {
    if (err) {
        return console.error('Aduh error bro, ga bisa baca foldernya:', err);
    }

    let changedCount = 0;

    files.forEach(file => {
        const oldPath = path.join(folderPath, file);

        if (fs.statSync(oldPath).isDirectory()) return;
        if (file.toLowerCase().includes('ica')) return;

        const ext = path.extname(file).toLowerCase();
        const newName = `ica_${counter}${ext}`;
        const newPath = path.join(folderPath, newName);

        try {
            fs.renameSync(oldPath, newPath);
            console.log(`✅ ${file}  ->  ${newName}`);
            counter++;
            changedCount++;
        } catch (error) {
            console.error(`❌ Gagal rename ${file}:`, error);
        }
    });

    console.log(`\nBerhasil bro! Ada ${changedCount} file yang udah diganti namanya jadi Ica.`);
});