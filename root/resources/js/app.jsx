import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    return (
        <div>
            <h1>Hello from React inside Laravel!</h1>
        </div>
    );
}

// React 18 のルート作成
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
