// fix-dto.ts
import fs from 'fs';
import path from 'path';

const folder = path.join(__dirname, 'src'); // your folder root

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');

  // regex: only non-optional fields
  const regex = /^(\s*)(\w+):\s*([^;]+);/gm;
  content = content.replace(regex, '$1$2!: $3;');

  fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk(folder);
console.log('DTO fix applied to all TypeScript files!');