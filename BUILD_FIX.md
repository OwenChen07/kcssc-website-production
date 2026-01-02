# Production Build Fix - ES Module Imports

## Problem

When running `npm run server:start:prod`, the server failed with:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/path/to/server/dist/db/connection'
```

## Root Cause

When using ES modules (`"type": "module"` in `package.json`) with TypeScript, Node.js requires explicit `.js` file extensions in import statements, even though the source files are `.ts`. TypeScript doesn't automatically add these extensions during compilation.

## Solution

Updated all relative imports in the server codebase to include `.js` extensions:

### Files Updated

1. **server/index.ts**
   - `./db/connection` → `./db/connection.js`
   - `./routes/events` → `./routes/events.js`
   - `./routes/programs` → `./routes/programs.js`
   - `./routes/photos` → `./routes/photos.js`
   - `./routes/upload` → `./routes/upload.js`
   - Dynamic imports in signal handlers also updated

2. **server/routes/events.ts**
   - `../db/connection` → `../db/connection.js`

3. **server/routes/photos.ts**
   - `../db/connection` → `../db/connection.js`

4. **server/routes/programs.ts**
   - `../db/connection` → `../db/connection.js`

5. **server/db/init-db.ts**
   - `./connection` → `./connection.js`

6. **server/db/migrate-photos.ts**
   - `./connection` → `./connection.js`

7. **server/db/seed-photos.ts**
   - `./connection` → `./connection.js`

## Verification

After the fix:
1. Build the server: `npm run server:build` ✅
2. The compiled output in `server/dist/` now includes `.js` extensions in all imports
3. The production server should now start successfully: `npm run server:start:prod`

## Why This Works

TypeScript allows importing `.js` files from `.ts` source files when targeting ES modules. During compilation, TypeScript preserves the `.js` extension in the output, which Node.js requires when using ES modules.

## Note

This is a requirement when using:
- `"type": "module"` in `package.json`
- `"module": "ES2020"` (or similar) in `tsconfig.json`
- Node.js ES module resolution

If you switch to CommonJS (`"module": "CommonJS"`), you don't need `.js` extensions, but the project is currently configured for ES modules.

