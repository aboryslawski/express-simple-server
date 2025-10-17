import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (endpoint) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/${endpoint}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({ error: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Express Simple Server - Now with Next.js!</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => fetchData('fetch-wordpress-graphql')}
          style={{ marginRight: '10px', padding: '10px 15px' }}
        >
          Fetch WordPress GraphQL
        </button>
        
        <button 
          onClick={() => fetchData('envs')}
          style={{ marginRight: '10px', padding: '10px 15px' }}
        >
          Show Environment Variables
        </button>
        
        <button 
          onClick={() => window.open('/api/', '_blank')}
          style={{ padding: '10px 15px' }}
        >
          Open Home URL Proxy
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {data && (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          <h3>Response:</h3>
          <pre style={{ overflow: 'auto', maxHeight: '400px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>Available Endpoints:</h3>
        <ul>
          <li><code>/api/</code> - Proxy to home URL</li>
          <li><code>/api/fetch-wordpress-graphql</code> - Fetch WordPress posts</li>
          <li><code>/api/envs</code> - Display environment variables</li>
        </ul>
        
        <h3>Rewrites Available:</h3>
        <ul>
          <li><code>/backend/*</code> → <code>/api/*</code> (e.g., /backend/envs → /api/envs)</li>
        </ul>
      </div>
    </div>
  );
}