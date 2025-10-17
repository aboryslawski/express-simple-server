import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testRedirectLoop = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-redirect-loop?url=https://hwx0ta7gulbtefguezlgtik6u.js.wpenginepoweredstaging.com/');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Test failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Redirect Loop Test</h1>
      
      <button 
        onClick={testRedirectLoop}
        style={{ 
          padding: '12px 20px', 
          backgroundColor: '#0070f3', 
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        🧪 Test Frontend URL for Redirect Loops
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
