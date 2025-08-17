import React, { useState } from 'react';

const testLogic = () => {
  // Replace this with your real test logic!
  // Example: Simulate a random pass/fail
  return Math.random() > 0.5 ? 'pass' : 'fail';
};

export default function TestRunner() {
  const [result, setResult] = useState(null);

  const runTest = () => {
    const testResult = testLogic();
    setResult(testResult);
  };

  return (
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      <h2>Run Demo Test</h2>
      <button
        onClick={runTest}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1.2rem',
          borderRadius: '8px',
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)'
        }}
      >
        Run Test
      </button>
      {result && (
        <div style={{ marginTop: '2rem' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              borderRadius: '2rem',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#fff',
              background: result === 'pass'
                ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
                : 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              animation: 'pop 0.5s'
            }}
          >
            {result === 'pass' ? '✅ PASS' : '❌ FAIL'}
          </span>
          <style>
            {`
              @keyframes pop {
                0% { transform: scale(0.7); opacity: 0.5; }
                80% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); }
              }
            `}
          </style>
          <div style={{ marginTop: '1rem', color: '#888' }}>
            {result === 'pass'
              ? 'All tests passed successfully!'
              : 'Some tests failed. Please check your code.'}
          </div>
        </div>
      )}
    </div>
  );
} 