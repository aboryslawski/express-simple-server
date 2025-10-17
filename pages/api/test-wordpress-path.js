import axios from 'axios';

export default async function handler(req, res) {
  const { path = '', method = 'GET' } = req.query;
  
  // Build the WordPress URL to test
  let wordpressUrl = process.env.WORDPRESS_URL || process.env.GRAPHQL_API_URL?.replace('/graphql', '') || 'https://your-wordpress-site.com';
  
  if (path) {
    wordpressUrl = `${wordpressUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }

  console.log('🎯 Testing WordPress URL:', wordpressUrl);
  console.log('🏠 Your frontend URL: https://hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com/');

  try {
    const response = await axios({
      method: method.toLowerCase(),
      url: wordpressUrl,
      maxRedirects: 0, // Don't follow redirects automatically
      validateStatus: function (status) {
        return status < 500; // Accept any status < 500
      },
      headers: {
        'User-Agent': 'Express-Simple-Server/1.0 (Redirect Loop Tester)',
        // Add referer to simulate coming from your frontend
        'Referer': 'https://hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com/'
      },
      timeout: 10000
    });

    const result = {
      url: wordpressUrl,
      status: response.status,
      statusText: response.statusText,
      headers: {
        'x-redirect-by': response.headers['x-redirect-by'],
        'location': response.headers.location,
        'content-type': response.headers['content-type'],
        'cache-control': response.headers['cache-control']
      },
      redirectInfo: {
        isRedirect: response.status >= 300 && response.status < 400,
        redirectLocation: response.headers.location,
        redirectBy: response.headers['x-redirect-by'],
        isFaustWPRedirect: response.headers['x-redirect-by']?.includes('WP Engine Headless') || false
      }
    };

    // Log the results
    console.log('📋 Response Status:', response.status);
    if (response.headers['x-redirect-by']) {
      console.log('🚨 X-Redirect-By:', response.headers['x-redirect-by']);
    }
    if (response.headers.location) {
      console.log('🔄 Redirects to:', response.headers.location);
    }

    // Check if this is a redirect back to the frontend (potential loop)
    if (response.headers.location && 
        response.headers.location.includes('hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com')) {
      result.potentialLoop = true;
      console.log('⚠️ WARNING: Redirect points back to your frontend URL - potential loop!');
    }

    res.status(200).json({
      success: true,
      message: `Tested ${method} request to ${wordpressUrl}`,
      result
    });

  } catch (error) {
    console.error('❌ Error testing WordPress URL:', error.message);
    
    // Handle redirect responses that axios treats as errors
    if (error.response && error.response.status >= 300 && error.response.status < 400) {
      const result = {
        url: wordpressUrl,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: {
          'x-redirect-by': error.response.headers['x-redirect-by'],
          'location': error.response.headers.location,
          'content-type': error.response.headers['content-type']
        },
        redirectInfo: {
          isRedirect: true,
          redirectLocation: error.response.headers.location,
          redirectBy: error.response.headers['x-redirect-by'],
          isFaustWPRedirect: error.response.headers['x-redirect-by']?.includes('WP Engine Headless') || false
        }
      };

      // Check for potential loop
      if (error.response.headers.location && 
          error.response.headers.location.includes('hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com')) {
        result.potentialLoop = true;
        console.log('⚠️ WARNING: Redirect points back to your frontend URL - potential loop!');
      }

      return res.status(200).json({
        success: true,
        message: `Redirect detected for ${method} request to ${wordpressUrl}`,
        result
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
      url: wordpressUrl
    });
  }
}