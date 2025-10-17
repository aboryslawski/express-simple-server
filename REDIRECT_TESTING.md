# FaustWP Redirect Loop Testing

This Express Simple Server has been enhanced to help debug potential redirect loops caused by the FaustWP plugin.

## What's Been Added

### 🔄 Automatic Redirect Loop Detection
- **Button**: "Test Redirect Loop Detection" (red button)
- **API Endpoint**: `/api/test-redirect-loop`
- **What it does**: Follows redirects from your WordPress site and detects loops
- **Looks for**: `X-Redirect-By: WP Engine Headless plugin` header

### 🎯 Manual Path Testing
- **Input field**: Test specific WordPress paths
- **Quick test buttons**: Homepage, common paths, wp-admin
- **API Endpoint**: `/api/test-wordpress-path?path=/your-path`
- **What it does**: Tests individual WordPress URLs for redirects

## Your Configuration

- **Frontend URL**: `https://hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com/`
- **WordPress URL**: Set via `GRAPHQL_API_URL` environment variable
- **Target Header**: `X-Redirect-By: WP Engine Headless plugin`

## How FaustWP Redirects Work

Based on the plugin code analysis:

1. **When enabled**: FaustWP redirects public WordPress URLs to your frontend
2. **Redirect logic**: `str_replace(WP_HOME_URL, FRONTEND_URI, REQUEST_URI)`
3. **Header added**: `X-Redirect-By: WP Engine Headless plugin`
4. **Status code**: 302 (configurable via filter)

## Potential Loop Scenarios

1. **Direct loop**: WordPress → Frontend → WordPress
2. **Asset requests**: Frontend requests WordPress assets that get redirected
3. **API calls**: Frontend makes API calls that trigger redirects
4. **Iframe/embed**: Frontend embeds WordPress content that redirects

## How to Test

### 1. Automatic Detection
```bash
npm run dev
# Open browser to localhost:3000
# Click "🔄 Test Redirect Loop Detection"
```

### 2. Manual Path Testing
```bash
# Test specific paths:
# - Enter path in input field (e.g., "/hello-world")
# - Or use quick test buttons
```

### 3. Check Console Logs
```bash
# Server logs will show:
# 🔍 Starting redirect loop detection...
# 🌐 Testing URL: your-wp-site
# 🚨 Found X-Redirect-By header: WP Engine Headless plugin
# 🔄 Redirect to: your-frontend-url
# 🔴 REDIRECT LOOP DETECTED! (if found)
```

## Environment Setup

Make sure your `wpe.json` or environment variables include:
```json
{
  "env_variables": [
    {
      "key": "GRAPHQL_API_URL", 
      "value": "https://your-wordpress-site.com/graphql"
    },
    {
      "key": "WORDPRESS_URL",
      "value": "https://your-wordpress-site.com"
    }
  ]
}
```

## What to Look For

### ✅ Good Signs
- WordPress admin accessible without redirects
- GraphQL endpoint works
- Static assets load properly
- Only public pages redirect to frontend

### 🚨 Red Flags
- Redirects pointing back to your frontend URL
- Multiple `X-Redirect-By` headers in sequence
- WordPress admin gets redirected
- API endpoints get redirected
- Assets (CSS/JS/images) get redirected

## Next Steps

1. Run the tests to identify if loops exist
2. Check which specific paths cause redirects
3. Verify your FaustWP plugin settings:
   - ✅ Frontend URI: `https://hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com/`
   - ✅ Enable redirects: ON (as configured)
   - Check excluded routes if loops are detected

## Debugging Tips

- Use browser dev tools Network tab to see redirect chains
- Check if your frontend makes requests back to WordPress
- Verify FaustWP exclusion filters are working
- Test with different user agents
- Check if there are any Next.js API routes that might conflict