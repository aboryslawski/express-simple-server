export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { action } = req.query;

  switch (action) {
    case 'redirect-to-home':
      // This will redirect back to the frontend home page
      return res.redirect(302, '/');
      
    case 'redirect-to-external':
      // This will redirect to the external URL
      return res.redirect(302, 'https://hpjmztojsgsfbln7ibyhxzt2s.js.wpenginepoweredstaging.com/');
      
    case 'process-and-redirect':
      // Process some data then redirect back to frontend with query params
      const processedData = { timestamp: Date.now(), processed: true };
      const queryString = new URLSearchParams({ 
        result: JSON.stringify(processedData) 
      }).toString();
      return res.redirect(302, `/?${queryString}`);
      
    default:
      return res.status(200).json({ 
        message: 'Backend processor',
        availableActions: [
          '/api/backend-processor?action=redirect-to-home',
          '/api/backend-processor?action=redirect-to-external',
          '/api/backend-processor?action=process-and-redirect'
        ]
      });
  }
}