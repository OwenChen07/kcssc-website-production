/**
 * Translation Checker Script
 * 
 * Checks which translation keys are missing in zh-CN and zh-TW files
 * Helps identify what needs to be translated
 * 
 * Usage:
 *   npm run translate:check
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface TranslationStats {
  total: number;
  missing: string[];
  existing: number;
}

// Recursively get all keys from an object
function getAllKeys(obj: any, prefix: string = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      keys.push(fullKey);
    } else if (value !== null && typeof value === 'object') {
      keys.push(...getAllKeys(value, fullKey));
    }
  }
  return keys;
}

// Get value by key path
function getValueByPath(obj: any, path: string): string | undefined {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

function checkTranslations(lang: 'zh-CN' | 'zh-TW'): TranslationStats {
  const enPath = path.join(projectRoot, 'src/locales/en/translation.json');
  const langPath = path.join(projectRoot, `src/locales/${lang}/translation.json`);

  if (!fs.existsSync(enPath)) {
    throw new Error(`English translation file not found: ${enPath}`);
  }

  const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const langTranslations = fs.existsSync(langPath)
    ? JSON.parse(fs.readFileSync(langPath, 'utf-8'))
    : {};

  const enKeys = getAllKeys(enTranslations);
  const missing: string[] = [];

  enKeys.forEach((key) => {
    const enValue = getValueByPath(enTranslations, key);
    const langValue = getValueByPath(langTranslations, key);

    if (!langValue && enValue) {
      missing.push(key);
    }
  });

  return {
    total: enKeys.length,
    missing,
    existing: enKeys.length - missing.length,
  };
}

function printStats(lang: 'zh-CN' | 'zh-TW', stats: TranslationStats) {
  const langName = lang === 'zh-CN' ? 'Chinese Simplified' : 'Chinese Traditional';
  console.log(`\n📊 ${langName} (${lang}):`);
  console.log(`   Total keys: ${stats.total}`);
  console.log(`   Translated: ${stats.existing} (${Math.round((stats.existing / stats.total) * 100)}%)`);
  console.log(`   Missing: ${stats.missing.length} (${Math.round((stats.missing.length / stats.total) * 100)}%)`);

  if (stats.missing.length > 0) {
    console.log(`\n   Missing translations:`);
    stats.missing.slice(0, 20).forEach((key) => {
      console.log(`   - ${key}`);
    });
    if (stats.missing.length > 20) {
      console.log(`   ... and ${stats.missing.length - 20} more`);
    }
  }
}

async function main() {
  console.log('🔍 Checking translation coverage...\n');

  try {
    const zhCNStats = checkTranslations('zh-CN');
    const zhTWStats = checkTranslations('zh-TW');

    printStats('zh-CN', zhCNStats);
    printStats('zh-TW', zhTWStats);

    const totalMissing = zhCNStats.missing.length + zhTWStats.missing.length;
    if (totalMissing === 0) {
      console.log('\n✅ All translations are complete!');
    } else {
      console.log(`\n⚠️  Total missing translations: ${totalMissing}`);
      console.log('\n💡 Tip: Use Google Translate or ChatGPT to translate missing strings in batches.');
      console.log('   Then add them to the translation JSON files manually.');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

