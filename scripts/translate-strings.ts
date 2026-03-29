/**
 * Automatic Translation Script
 * 
 * Translates English strings to Chinese Simplified (zh-CN) and Traditional (zh-TW)
 * using Google Translate API
 * 
 * Requirements:
 * - Set GOOGLE_TRANSLATE_API_KEY in .env file
 * - Free tier: 500,000 characters/month
 * 
 * Usage:
 *   npm run translate:auto
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

// Translate text using Google Translate API
async function translateText(text: string, targetLang: 'zh-CN' | 'zh-TW'): Promise<string> {
  if (!API_KEY) {
    throw new Error('GOOGLE_TRANSLATE_API_KEY not found in environment variables');
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang === 'zh-CN' ? 'zh-CN' : 'zh-TW',
        source: 'en',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Translation API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error(`Error translating "${text}":`, error);
    throw error;
  }
}

// Recursively translate an object
async function translateObject(
  obj: any,
  targetLang: 'zh-CN' | 'zh-TW',
  path: string[] = []
): Promise<any> {
  if (typeof obj === 'string') {
    // Skip empty strings or very short strings
    if (obj.trim().length < 2) {
      return obj;
    }
    console.log(`  Translating: "${obj.substring(0, 50)}${obj.length > 50 ? '...' : ''}"`);
    const translated = await translateText(obj, targetLang);
    // Small delay to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 200));
    return translated;
  } else if (Array.isArray(obj)) {
    return Promise.all(obj.map((item, index) => translateObject(item, targetLang, [...path, String(index)])));
  } else if (obj !== null && typeof obj === 'object') {
    const translated: any = {};
    for (const [key, value] of Object.entries(obj)) {
      translated[key] = await translateObject(value, targetLang, [...path, key]);
    }
    return translated;
  }
  return obj;
}

async function main() {
  console.log('🌐 Automatic Translation Script\n');

  if (!API_KEY) {
    console.error('❌ Error: GOOGLE_TRANSLATE_API_KEY not found in environment variables\n');
    console.log('To get a free API key:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a project or select existing');
    console.log('3. Enable "Cloud Translation API"');
    console.log('4. Create credentials (API Key)');
    console.log('5. Add to .env file: GOOGLE_TRANSLATE_API_KEY=your_key_here\n');
    process.exit(1);
  }

  const enPath = path.join(projectRoot, 'src/locales/en/translation.json');
  
  if (!fs.existsSync(enPath)) {
    console.error(`❌ Error: English translation file not found at ${enPath}`);
    process.exit(1);
  }

  console.log('📖 Reading English translations...\n');
  const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  // Translate to zh-CN
  console.log('🔄 Translating to Chinese Simplified (zh-CN)...\n');
  const zhCNTranslations = await translateObject(enTranslations, 'zh-CN');
  const zhCNPath = path.join(projectRoot, 'src/locales/zh-CN/translation.json');
  fs.writeFileSync(zhCNPath, JSON.stringify(zhCNTranslations, null, 2));
  console.log(`✅ Saved: ${zhCNPath}\n`);

  // Translate to zh-TW
  console.log('🔄 Translating to Chinese Traditional (zh-TW)...\n');
  const zhTWTranslations = await translateObject(enTranslations, 'zh-TW');
  const zhTWPath = path.join(projectRoot, 'src/locales/zh-TW/translation.json');
  fs.writeFileSync(zhTWPath, JSON.stringify(zhTWTranslations, null, 2));
  console.log(`✅ Saved: ${zhTWPath}\n`);

  console.log('✨ Translation complete!');
  console.log('\n⚠️  Note: Machine translations may need manual review for accuracy and cultural appropriateness.\n');
}

main().catch((error) => {
  console.error('❌ Translation failed:', error);
  process.exit(1);
});

