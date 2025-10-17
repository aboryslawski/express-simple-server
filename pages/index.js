import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirectLogs, setRedirectLogs] = useState([]);

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

  const testRedirectLoop = async () => {
    setLoading(true);
    setRedirectLogs([]);
    try {
      const response = await fetch('/api/test-redirect-loop');
      const result = await response.json();
      setRedirectLogs(result.logs || []);
      setData(result);
    } catch (error) {
      console.error('Error testing redirect loop:', error);
      setData({ error: 'Failed to test redirect loop' });
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
          onClick={testRedirectLoop}
          style={{ marginRight: '10px', padding: '10px 15px', backgroundColor: '#ff6b6b', color: 'white' }}
        >
          🔄 Test Redirect Loop Detection
        </button>
        
        <button 
          onClick={() => window.open('/api/', '_blank')}
          style={{ padding: '10px 15px' }}
        >
          Open Home URL Proxy
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {redirectLogs.length > 0 && (
        <div style={{ 
          backgroundColor: '#ffe6e6', 
          padding: '15px', 
          borderRadius: '5px',
          marginTop: '20px',
          border: '2px solid #ff6b6b'
        }}>
          <h3>🚨 Redirect Loop Detection Results:</h3>
          {redirectLogs.map((log, index) => (
            <div key={index} style={{ marginBottom: '10px', padding: '5px', backgroundColor: '#fff' }}>
              <strong>Step {index + 1}:</strong> 
              <br />
              <strong>URL:</strong> {log.url}
              <br />
              <strong>Status:</strong> {log.status}
              <br />
              {log.redirectBy && <><strong>X-Redirect-By:</strong> {log.redirectBy}<br /></> }
              {log.location && <><strong>Location:</strong> {log.location}<br /></> }
              {log.error && <><strong>Error:</strong> {log.error}<br /></> }
            </div>
          ))}
        </div>
      )}
      
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

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#e6f3ff', 
        borderRadius: '5px',
        border: '2px solid #0066cc'
      }}>
        <h3>🔧 Manual Redirect Testing</h3>
        <p>Test specific WordPress paths for FaustWP redirects:</p>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="text" 
            placeholder="e.g., /sample-page, /hello-world, /" 
            style={{ padding: '8px', width: '300px', marginRight: '10px' }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const path = e.target.value;
                fetchData(`test-wordpress-path?path=${encodeURIComponent(path)}`);
              }
            }}
          />
          <button 
            onClick={(e) => {
              const input = e.target.previousElementSibling;
              const path = input.value;
              fetchData(`test-wordpress-path?path=${encodeURIComponent(path)}`);
            }}
            style={{ padding: '8px 15px' }}
          >
            Test Path
          </button>
        </div>
        <p><strong>Quick Tests:</strong></p>
        <div>
          <button 
            onClick={() => fetchData('test-wordpress-path?path=/')}
            style={{ margin: '5px', padding: '5px 10px', fontSize: '12px' }}
          >
            Test Homepage (/)
          </button>
          <button 
            onClick={() => fetchData('test-wordpress-path?path=/hello-world')}
            style={{ margin: '5px', padding: '5px 10px', fontSize: '12px' }}
          >
            Test /hello-world
          </button>
          <button 
            onClick={() => fetchData('test-wordpress-path?path=/sample-page')}
            style={{ margin: '5px', padding: '5px 10px', fontSize: '12px' }}
          >
            Test /sample-page
          </button>
          <button 
            onClick={() => fetchData('test-wordpress-path?path=/wp-admin')}
            style={{ margin: '5px', padding: '5px 10px', fontSize: '12px' }}
          >
            Test /wp-admin
          </button>
        </div>
      </div>

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>🔍 FaustWP Redirect Loop Debug Info:</h3>
        <p>Your frontend URL: <code>https://hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com/</code></p>
        <p>Looking for header: <code>X-Redirect-By: WP Engine Headless plugin</code></p>
        
        <h3>Available Endpoints:</h3>
        <ul>
          <li><code>/api/</code> - Proxy to home URL</li>
          <li><code>/api/fetch-wordpress-graphql</code> - Fetch WordPress posts</li>
          <li><code>/api/envs</code> - Display environment variables</li>
          <li><code>/api/test-redirect-loop</code> - Automated redirect loop detection</li>
          <li><code>/api/test-wordpress-path</code> - Test specific WordPress paths</li>
        </ul>
        
        <h3>Rewrites Available:</h3>
        <ul>
          <li><code>/backend/*</code> → <code>/api/*</code> (e.g., /backend/envs → /api/envs)</li>
        </ul>
      </div>
    </div>
  );
}