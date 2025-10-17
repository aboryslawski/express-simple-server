import axios from 'axios';

export default async function handler(req, res) {
  const logs = [];
  const maxRedirects = 10; // Prevent infinite loops
  
  // Try to determine the WordPress URL from environment variables
  let currentUrl = process.env.WORDPRESS_URL;
  
  // If no direct WordPress URL, try to derive from GraphQL API URL
  if (!currentUrl && process.env.GRAPHQL_API_URL) {
    currentUrl = process.env.GRAPHQL_API_URL.replace('/graphql', '');
  }
  
  // If still no URL, return error with helpful message
  if (!currentUrl || currentUrl === 'https://your-wordpress-site.com') {
    return res.status(400).json({
      success: false,
      error: 'WordPress URL not configured',
      message: 'Please set WORDPRESS_URL or GRAPHQL_API_URL environment variable',
      availableEnvs: {
        WORDPRESS_URL: process.env.WORDPRESS_URL || 'not set',
        GRAPHQL_API_URL: process.env.GRAPHQL_API_URL || 'not set'
      },
      suggestion: 'Try clicking "Show Environment Variables" button first to see what URLs are configured'
    });
  }

  try {
    console.log('🔍 Starting redirect loop detection...');
    console.log('🌐 Testing URL:', currentUrl);
    console.log('🏠 Frontend URI should be: https://hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com/');

    for (let i = 0; i < maxRedirects; i++) {
      try {
        console.log(`\n📍 Step ${i + 1}: Testing ${currentUrl}`);
        
        const response = await axios.get(currentUrl, {
          maxRedirects: 0, // Don't auto-follow redirects
          validateStatus: function (status) {
            return status < 400; // Accept any status < 400
          },
          timeout: 10000 // 10 second timeout
        });

        const logEntry = {
          url: currentUrl,
          status: response.status,
          headers: response.headers
        };

        // Check for redirect headers
        if (response.headers['x-redirect-by']) {
          logEntry.redirectBy = response.headers['x-redirect-by'];
          console.log('🚨 Found X-Redirect-By header:', logEntry.redirectBy);
        }

        if (response.headers.location) {
          logEntry.location = response.headers.location;
          console.log('🔄 Redirect to:', logEntry.location);
          
          // Check if this creates a loop
          const isLoop = logs.some(log => log.url === response.headers.location);
          if (isLoop) {
            logEntry.isLoop = true;
            console.log('🔴 REDIRECT LOOP DETECTED!');
            logs.push(logEntry);
            break;
          }
          
          currentUrl = response.headers.location;
        }

        logs.push(logEntry);

        // If no redirect, we're done
        if (!response.headers.location) {
          console.log('✅ No more redirects, finished successfully');
          break;
        }

      } catch (error) {
        console.log('❌ Error in redirect test:', error.message);
        
        // Handle redirect responses (3xx status codes)
        if (error.response && error.response.status >= 300 && error.response.status < 400) {
          const logEntry = {
            url: currentUrl,
            status: error.response.status,
            headers: error.response.headers
          };

          if (error.response.headers['x-redirect-by']) {
            logEntry.redirectBy = error.response.headers['x-redirect-by'];
            console.log('🚨 Found X-Redirect-By header:', logEntry.redirectBy);
          }

          if (error.response.headers.location) {
            logEntry.location = error.response.headers.location;
            console.log('🔄 Redirect to:', logEntry.location);
            
            // Check if this creates a loop
            const isLoop = logs.some(log => log.url === error.response.headers.location);
            if (isLoop) {
              logEntry.isLoop = true;
              console.log('🔴 REDIRECT LOOP DETECTED!');
              logs.push(logEntry);
              break;
            }
            
            currentUrl = error.response.headers.location;
          }

          logs.push(logEntry);
        } else {
          // Real error
          logs.push({
            url: currentUrl,
            error: error.message,
            status: error.response ? error.response.status : 'Network Error'
          });
          break;
        }
      }
    }

    // Check if we hit the max redirects (potential infinite loop)
    if (logs.length >= maxRedirects) {
      console.log('⚠️ Hit maximum redirect limit - potential infinite loop');
    }

    // Summary
    const hasLoop = logs.some(log => log.isLoop);
    const hasPluginRedirects = logs.some(log => log.redirectBy && log.redirectBy.includes('WP Engine Headless'));
    
    console.log('\n📊 SUMMARY:');
    console.log('- Total redirects:', logs.length);
    console.log('- Loop detected:', hasLoop);
    console.log('- FaustWP redirects found:', hasPluginRedirects);

    res.status(200).json({
      success: true,
      message: 'Redirect loop test completed',
      logs,
      summary: {
        totalRedirects: logs.length,
        loopDetected: hasLoop,
        faustWPRedirectsFound: hasPluginRedirects,
        testedUrl: process.env.GRAPHQL_API_URL ? process.env.GRAPHQL_API_URL.replace('/graphql', '') : currentUrl
      }
    });

  } catch (error) {
    console.error('💥 Fatal error in redirect test:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      logs
    });
  }
}