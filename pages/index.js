import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testRedirectLoop = async () => {
    setLoading(true);
    try {
      // Test a WordPress URL instead of frontend URL
      const response = await fetch('/api/test-redirect-loop?url=https://your-wordpress-site.com/sample-page');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Test failed - Need WordPress URL, not frontend URL' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>FaustWP Redirect Test</h1>
      <p><strong>⚠️ Important:</strong> You need to test a <strong>WordPress URL</strong>, not your frontend URL!</p>
      <p>FaustWP only runs on WordPress and redirects TO your frontend: <code>hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com</code></p>
      
      <button 
        onClick={testRedirectLoop}
        style={{ 
          padding: '12px 20px', 
          backgroundColor: '#ff6b6b', 
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        🧪 Test WordPress URL (Currently: your-wordpress-site.com)
      </button>

      {loading && <p>Loading...</p>}
      
      {result && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
