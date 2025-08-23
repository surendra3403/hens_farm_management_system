import React from 'react';
import './App.css';

function App() {
  console.log('App component rendering...'); // Debug log
  
  return (
    <div className="App" style={{ 
      padding: '20px', 
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🐔 Hen's Farm Management System
      </h1>
      <p style={{ color: '#666', fontSize: '18px' }}>
        Welcome to the farm management system!
      </p>
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <p>✅ React is working!</p>
        <p>✅ App is rendering!</p>
        <p>✅ CSS is loading!</p>
      </div>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>
        <p>Check the browser console for debug logs</p>
        <p>Current time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

export default App;
