import { readFileSync, writeFileSync } from 'fs';

const packageJsonPath = './package.json';
const versionFilePath = './src/config/version.js';

// Ler o package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

// Atualizar a versão (incrementa o último número)
const versionParts = packageJson.version.split('.');
versionParts[versionParts.length - 1] = (parseInt(versionParts[versionParts.length - 1]) + 1).toString();
packageJson.version = versionParts.join('.');

// Obter a data atual no formato YYYY-MM-DD
const now = new Date();
const formattedDate = now.toISOString().split('T')[0];

// Escrever de volta no package.json
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// Atualizar o arquivo de configuração no frontend
const versionFileContent = `export const appVersion = "${packageJson.version}";\nexport const appBuildDate = "${formattedDate}";\n`;
writeFileSync(versionFilePath, versionFileContent);

console.log(`Versão atualizada para ${packageJson.version} em ${formattedDate}`);
