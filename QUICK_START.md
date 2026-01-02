# Quick Start Guide

Get the KCSSC website running in 2 minutes with mock data, or set up Supabase for full functionality.

## Option 1: Quick Start with Mock Data (2 minutes)

Perfect for development and testing. No database setup required!

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

That's it! The app will:
- ✅ Run on http://localhost:8080
- ✅ Use mock data (no database needed)
- ✅ Show all features in read-only mode
- ⚠️ Admin features (create/edit/delete) won't work without Supabase

You'll see a console warning about missing Supabase credentials - this is normal and expected.

## Option 2: Full Setup with Supabase (10 minutes)

For production use or to enable admin features:

1. Follow the [Supabase Setup Guide](SETUP_SUPABASE.md)
2. Create a `.env` file with your Supabase credentials
3. Run `npm run dev`

See [SETUP_SUPABASE.md](SETUP_SUPABASE.md) for detailed instructions.

## Troubleshooting

### Blank Screen / Console Errors

If you see a blank screen:
1. Check the browser console for errors
2. Make sure you've run `npm install`
3. Try clearing your browser cache
4. Check that the dev server is running on port 8080

### "Supabase URL is required" Error

This error is normal if you haven't set up Supabase yet. The app will automatically use mock data. To remove the warning:
- Set up Supabase (see Option 2 above), OR
- Create a `.env` file with placeholder values (not recommended for production)

### Admin Features Not Working

Admin features (create/edit/delete) require Supabase configuration. Follow [SETUP_SUPABASE.md](SETUP_SUPABASE.md) to enable them.

## Next Steps

- **Development**: Use mock data - no setup needed!
- **Production**: Set up Supabase for full functionality
- **Deployment**: See [SETUP_SUPABASE.md](SETUP_SUPABASE.md) deployment section

