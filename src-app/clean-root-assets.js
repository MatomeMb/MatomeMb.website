import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../');

const assetsDir = path.join(rootDir, 'assets');

if (fs.existsSync(assetsDir)) {
  console.log('Cleaning old build assets directory:', assetsDir);
  fs.rmSync(assetsDir, { recursive: true, force: true });
}
