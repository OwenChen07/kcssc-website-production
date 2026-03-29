/**
 * String Extraction Helper
 * 
 * Extracts hardcoded strings from a component file to help identify
 * what needs to be added to translation files
 * 
 * Usage:
 *   tsx scripts/extract-strings.ts src/pages/Events.tsx
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function extractStrings(filePath: string): { text: string; line: number; context: string }[] {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(projectRoot, filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.split('\n');
  const strings: { text: string; line: number; context: string }[] = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Skip comments, imports, and code-only lines
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('import') ||
      trimmed.startsWith('export') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('{/*') ||
      trimmed.startsWith('*/}')
    ) {
      return;
    }

    // Extract from text attributes (title, description, placeholder, etc.)
    const textAttributeRegex = /(title|description|placeholder|aria-label|label|alt)\s*=\s*["']([^"\\]|\\.)*["']/gi;
    let match;
    while ((match = textAttributeRegex.exec(line)) !== null) {
      const text = match[2].replace(/\\(.)/g, '$1'); // Unescape
      if (text.length >= 3 && text.match(/[a-zA-Z]/)) {
        strings.push({
          text: text,
          line: lineNum,
          context: trimmed.substring(0, 80),
        });
      }
    }

    // Extract JSX text content (between tags)
    const jsxTextRegex = />\s*([^<>{}\n]+[a-zA-Z][^<>{}\n]+)\s*</g;
    while ((match = jsxTextRegex.exec(line)) !== null) {
      const text = match[1].trim();
      // Skip if it looks like code, CSS, or very short
      if (
        text.length >= 3 &&
        !text.match(/^[a-z0-9\-:\/\.\s]+$/) && // Not CSS classes
        !text.match(/^[A-Z][a-zA-Z0-9]*$/) && // Not component names
        !text.includes('${') &&
        text.match(/[a-zA-Z]/) &&
        !text.match(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) // Not email
      ) {
        strings.push({
          text: text,
          line: lineNum,
          context: trimmed.substring(0, 80),
        });
      }
    }
  });

  // Remove duplicates
  const unique = new Map<string, { text: string; line: number; context: string }>();
  strings.forEach((str) => {
    if (!unique.has(str.text)) {
      unique.set(str.text, str);
    }
  });

  return Array.from(unique.values());
}

function generateTranslationKey(text: string, namespace: string = 'pages'): string {
  // Generate a reasonable key from the text
  const key = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '.')
    .substring(0, 50)
    .replace(/\.+$/, '');

  return `${namespace}.${key}`;
}

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('❌ Please provide a file path');
    console.log('\nUsage:');
    console.log('  tsx scripts/extract-strings.ts src/pages/Events.tsx');
    process.exit(1);
  }

  try {
    console.log(`🔍 Extracting strings from: ${filePath}\n`);
    const strings = extractStrings(filePath);

    if (strings.length === 0) {
      console.log('✅ No translatable strings found in this file.');
      return;
    }

    console.log(`📝 Found ${strings.length} potential strings to translate:\n`);
    console.log('='.repeat(80));

    // Group by approximate namespace
    const namespace = filePath.includes('pages') ? 'pages' : 'components';
    const relativePath = path.relative(projectRoot, filePath);
    const fileName = path.basename(filePath, path.extname(filePath));

    strings.forEach((str, index) => {
      const suggestedKey = generateTranslationKey(str.text, `${namespace}.${fileName.toLowerCase()}`);
      console.log(`\n${index + 1}. Line ${str.line}:`);
      console.log(`   Text: "${str.text}"`);
      console.log(`   Suggested key: ${suggestedKey}`);
      console.log(`   Context: ${str.context}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n💡 Next steps:');
    console.log('1. Add these strings to src/locales/en/translation.json');
    console.log('2. Use Google Translate or ChatGPT to translate them');
    console.log('3. Add translations to src/locales/zh-CN/translation.json and zh-TW/translation.json');
    console.log('4. Replace hardcoded strings in the component with t("key.path")');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
