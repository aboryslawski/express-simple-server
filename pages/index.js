import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirectLogs, setRedirectLogs] = useState([]);
  const [testUrl, setTestUrl] = useState('');

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

  const testRedirectLoop = async (url = '') => {
    setLoading(true);
    setRedirectLogs([]);
    try {
      const queryParam = url ? `?url=${encodeURIComponent(url)}` : '';
      const response = await fetch(`/api/test-redirect-loop${queryParam}`);
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
      </div>

      {/* URL Testing Section */}
      <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #ff6b6b', borderRadius: '10px', backgroundColor: '#fff5f5' }}>
        <h3>🧪 Hypothesis Testing: Redirect Loops</h3>
        <p><strong>Your Hypothesis:</strong> Setting <code>$frontend_uri</code> to <code>https://hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com/</code> might cause redirect loops.</p>
        
        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Test URL for redirect loops:
          </label>
          <input
            type="text"
            placeholder="Enter any URL to test for redirect loops..."
            style={{ 
              width: '500px', 
              padding: '10px', 
              borderRadius: '5px', 
              border: '1px solid #ccc',
              marginRight: '10px'
            }}
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
          />
        </div>
        
        <div style={{ margin: '10px 0' }}>
          <button 
            onClick={() => testRedirectLoop(testUrl)}
            style={{ 
              marginRight: '10px', 
              padding: '12px 20px', 
              backgroundColor: '#ff6b6b', 
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 Test for Redirect Loops
          </button>
          
          <button 
            onClick={() => {
              setTestUrl('https://hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com/');
              testRedirectLoop('https://hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com/');
            }}
            style={{ 
              marginRight: '10px', 
              padding: '12px 20px', 
              backgroundColor: '#4CAF50', 
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🎯 Test Your Frontend URL
          </button>
        </div>
        
        <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          <strong>💡 What this tests:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            <li>Follows redirect chains and detects loops</li>
            <li>Looks for <code>X-Redirect-By: WP Engine Headless plugin</code> headers (FaustWP signatures)</li>
            <li>Shows you the exact redirect path to identify problems</li>
          </ul>
        </div>
        
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
        
        <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '5px', margin: '10px 0', border: '1px solid #ffeaa7' }}>
          <strong>⚠️ Important:</strong> Make sure to configure your WordPress URL first!
          <br />
          Click "Show Environment Variables" to see your current configuration.
          <br />
          The test needs either <code>WORDPRESS_URL</code> or <code>GRAPHQL_API_URL</code> to work properly.
        </div>
        
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