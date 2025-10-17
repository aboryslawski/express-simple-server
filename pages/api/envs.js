export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('🔍 Environment Variables:');
  console.log('WORDPRESS_URL:', process.env.WORDPRESS_URL || 'not set');
  console.log('GRAPHQL_API_URL:', process.env.GRAPHQL_API_URL || 'not set');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
  
  // Return key environment variables (filtered for security)
  const envVars = {
    WORDPRESS_URL: process.env.WORDPRESS_URL || 'not set',
    GRAPHQL_API_URL: process.env.GRAPHQL_API_URL || 'not set',
    NODE_ENV: process.env.NODE_ENV || 'not set',
    PORT: process.env.PORT || 'not set'
  };

  // Derive WordPress URL if possible
  let derivedWordPressUrl = null;
  if (process.env.GRAPHQL_API_URL) {
    derivedWordPressUrl = process.env.GRAPHQL_API_URL.replace('/graphql', '');
  }

  res.status(200).json({ 
    message: 'Environment variables retrieved',
    envVars,
    derivedWordPressUrl,
    recommendation: derivedWordPressUrl 
      ? `Use ${derivedWordPressUrl} as your WordPress URL for testing`
      : 'Please configure WORDPRESS_URL or GRAPHQL_API_URL environment variable'
  });
}